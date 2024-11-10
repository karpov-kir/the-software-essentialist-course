import { isStartTimeLessThanEndTime, isTimeValid, parseTimeRange } from './time';

export class TimeValidator {
  isValidMilitaryTimeRange(timeRange: string) {
    const { start, end } = parseTimeRange(timeRange);

    return isTimeValid(start) && isTimeValid(end) && isStartTimeLessThanEndTime(start, end);
  }
}
