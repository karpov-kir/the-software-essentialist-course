import { TimeValidator } from './index';

const timeValidator = new TimeValidator();

describe(TimeValidator, () => {
  describe('valid time', () => {
    it.each(['13:30 - 15:30', '1:10 - 5:10'])('tells that "%s" is a valid military time range', (range: string) => {
      expect(timeValidator.isValidMilitaryTimeRange(range)).toBeTruthy();
    });
  });

  describe('invalid time', () => {
    it('tells that "15:30 - 15:30" is not a valid military time range', () => {
      expect(timeValidator.isValidMilitaryTimeRange('15:30 - 15:30')).toBeFalsy();
    });

    describe('invalid time because of syntax', () => {
      it.each(['14:30 - 15:30 asd', 'asd 14:30 - 15:30', '14:30 - 15:30 -', '- 14:30 - 15:30'])(
        'tells that "%s" is not a valid military time range',
        (range: string) => {
          expect(timeValidator.isValidMilitaryTimeRange(range)).toBeFalsy();
        },
      );
    });

    describe('invalid time because of hours', () => {
      it.each([
        '25:30 - 15:30',
        '15:30 - 25:30',
        '-13:30 - 15:30',
        '15:30 - -16:30',
        '15.5:30 - 16:30',
        '15:30 - 14:30',
      ])('tells that "%s" is not a valid military time range', (range: string) => {
        expect(timeValidator.isValidMilitaryTimeRange(range)).toBeFalsy();
      });
    });

    describe('invalid time because of minutes', () => {
      it.each(['13:-1 - 15:30', '13:60 - 15:30', '13:30 - 15:-1', '13:30 - 15:60', '13:3.5 - 15:30', '15:30 - 15:25'])(
        'tells that "%s" is not a valid military time range',
        (range: string) => {
          expect(timeValidator.isValidMilitaryTimeRange(range)).toBeFalsy();
        },
      );
    });
  });
});
