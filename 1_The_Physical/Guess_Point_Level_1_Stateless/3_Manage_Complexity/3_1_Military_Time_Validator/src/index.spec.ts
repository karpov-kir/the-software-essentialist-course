import { TimeValidator } from './index';

const timeValidator = new TimeValidator();

describe(TimeValidator, () => {
  describe('valid time', () => {
    it('tells that "13:30 - 15:30" is a valid military time range', () => {
      expect(timeValidator.isValidMilitaryTimeRange('13:30 - 15:30')).toBeTruthy();
    });
  });

  describe('invalid time because of hours', () => {
    it('tells that "25:30 - 15:30" is not valid military time range', () => {
      expect(timeValidator.isValidMilitaryTimeRange('25:30 - 15:30')).toBeFalsy();
    });

    it('tells that "15:30 - 25:30" is not valid military time range', () => {
      expect(timeValidator.isValidMilitaryTimeRange('15:30 - 25:30')).toBeFalsy();
    });
  });
});
