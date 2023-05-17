interface Time {
  hour: number;
  minute: number;
}

interface TimeRange {
  start: Time;
  end: Time;
}

const isHourValid = (hour: number) => {
  return Number.isInteger(hour) && hour >= 0 && hour <= 24;
};

const isMinuteValid = (minute: number) => {
  return Number.isInteger(minute) && minute >= 0 && minute <= 59;
};

export const isTimeValid = (time: Time) => {
  return isHourValid(time.hour) && isMinuteValid(time.minute);
};

export const isStartTimeLessThanEndTime = (start: Time, end: Time) => {
  if (start.hour > end.hour) {
    return false;
  } else if (start.hour === end.hour) {
    if (start.minute >= end.minute) {
      return false;
    }
  }

  return true;
};

/**
 * It cuts only spaces the rest is required to be an int number otherwise NaN is returned.
 */
const parseIntStrict = (rawPart: string) => {
  const rawPartWithoutSpaces = rawPart.replace(/\s/g, '');
  const isDigit = !/^\d+$/.test(rawPartWithoutSpaces);

  if (isDigit) {
    return NaN;
  }

  return parseInt(rawPartWithoutSpaces);
};

/**
 * It parses whatever it can parse without validation.
 */
export const parseTimeRange = (timeRange: string): TimeRange => {
  const start = {
    hour: NaN,
    minute: NaN,
  };
  const end = {
    hour: NaN,
    minute: NaN,
  };

  const timeParts = timeRange.split('-');

  if (timeParts.length !== 2) {
    return {
      start,
      end,
    };
  }

  const [rawStartTime, rawEndTime] = timeRange.split('-');
  const [rawStartHour, rawStartMinute] = rawStartTime.split(':');
  const [rawEndHour, rawEndMinute] = rawEndTime.split(':');

  start.hour = parseIntStrict(rawStartHour);
  start.minute = parseIntStrict(rawStartMinute);

  end.hour = parseIntStrict(rawEndHour);
  end.minute = parseIntStrict(rawEndMinute);

  return {
    start,
    end,
  };
};
