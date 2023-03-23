interface Time {
  hour: number;
  minute: number;
}

interface TimeRange {
  start: Time;
  end: Time;
}

const isHourValid = (hour: number) => {
  return Number.isFinite(hour) && hour >= 0 && hour <= 24;
};

const isMinuteValid = (minute: number) => {
  return Number.isFinite(minute) && minute >= 0 && minute <= 59;
};

export const isTimeValid = (time: Time) => {
  return isHourValid(time.hour) && isMinuteValid(time.minute);
};

export const parseTimeRange = (timeRange: string): TimeRange => {
  const [rawStartTime, rawEndTime] = timeRange.split('-');
  const [rawStartHour, rawStartMinute] = rawStartTime.split(':');
  const [rawEndHour, rawEndMinute] = rawEndTime.split(':');

  const start: Time = {
    hour: parseFloat(rawStartHour),
    minute: parseFloat(rawStartMinute),
  };

  const end: Time = {
    hour: parseFloat(rawEndHour),
    minute: parseFloat(rawEndMinute),
  };

  return {
    start,
    end,
  };
};
