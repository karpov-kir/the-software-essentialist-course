export class TimeValidator {
  isValidMilitaryTimeRange(timeRange: string) {
    const { startHours, endHours } = getTimeRangeParts(timeRange);

    return (
      parseInt(startHours) <= 24 && parseInt(endHours) <= 24 && parseInt(startHours) >= 0 && parseInt(endHours) >= 0
    );
  }
}

const getTimeRangeParts = (timeRange: string) => {
  const [startTime, endTime] = timeRange.split('-');
  const [startHours, startMinutes] = startTime.split(':');
  const [endHours, endMinutes] = endTime.split(':');

  return {
    startTime,
    endTime,
    startHours,
    endHours,
    startMinutes,
    endMinutes,
  };
};
