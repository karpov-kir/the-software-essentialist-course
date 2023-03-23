export class TimeValidator {
  isValidMilitaryTimeRange(timeRange: string) {
    const { startHours, endHours, startMinutes, endMinutes } = parseTimeRangeParts(timeRange);

    return isHourValid(startHours) && isHourValid(endHours) && isMinuteValid(startMinutes) && isMinuteValid(endMinutes);
  }
}

const parseTimeRangeParts = (timeRange: string) => {
  const [rawStartTime, rawEndTime] = timeRange.split('-');
  const [rawStartHours, rawStartMinutes] = rawStartTime.split(':');
  const [rawEndHours, rawEndMinutes] = rawEndTime.split(':');

  return {
    startTime: parseFloat(rawStartTime),
    endTime: parseFloat(rawEndTime),
    startHours: parseFloat(rawStartHours),
    endHours: parseFloat(rawEndHours),
    startMinutes: parseFloat(rawStartMinutes),
    endMinutes: parseFloat(rawEndMinutes),
  };
};

const isHourValid = (hour: number) => {
  return Number.isFinite(hour) && hour >= 0 && hour <= 24;
};

const isMinuteValid = (minute: number) => {
  return Number.isFinite(minute) && minute >= 0 && minute <= 59;
};
