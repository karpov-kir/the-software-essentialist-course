import { TimeValidator } from './index';

const timeValidator = new TimeValidator();

describe(TimeValidator, () => {
  it('tells that "13:30 - 15:30" is a valid military time range', () => {
    expect(timeValidator.isValidMilitaryTimeRange('13:30 - 15:30')).toBeTruthy();
  });

  it('tells that "25:30 - 15:30" is not valid military time range', () => {
    expect(timeValidator.isValidMilitaryTimeRange('25:30 - 15:30')).toBeFalsy();
  });
});
