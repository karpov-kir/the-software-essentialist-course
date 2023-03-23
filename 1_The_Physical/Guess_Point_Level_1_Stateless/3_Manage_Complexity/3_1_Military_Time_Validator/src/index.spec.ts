import { TimeValidator } from './index';

const timeValidator = new TimeValidator();

describe(TimeValidator, () => {
  it('tells that "13:30 - 15:30" is a valid military time', () => {
    expect(timeValidator.isValidMilitaryTimeRange('13:30 - 15:30')).toBeTruthy();
  });
});
