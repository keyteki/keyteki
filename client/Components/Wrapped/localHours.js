/**
 * Converts Wrapped's start times (UTC, by month and quarter of an hour) to games per hour in a timezone, using
 * each month's own offset, so daylight saving and half or quarter hour timezones come out right
 * @param {number[][]} startTimes 12 months of 96 counts, from WrappedService
 * @param {number} year
 * @param {(date: Date) => number} [offsetMinutes] The timezone's offset from UTC at a date, in minutes
 *     (defaults to the browser's)
 * @returns {number[]} 24 counts, by local hour
 */
export const localHours = (
    startTimes,
    year,
    offsetMinutes = (date) => -date.getTimezoneOffset()
) => {
    const hours = new Array(24).fill(0);

    startTimes.forEach((quarters, month) => {
        // Mid-month, so a daylight saving change only affects the days on the wrong side of it
        const offset = offsetMinutes(new Date(Date.UTC(year, month, 15, 12)));

        quarters.forEach((count, quarter) => {
            const minute = (((quarter * 15 + offset) % 1440) + 1440) % 1440;
            hours[Math.floor(minute / 60)] += count;
        });
    });

    return hours;
};
