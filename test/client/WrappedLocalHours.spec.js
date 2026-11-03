import { localHours } from '../../client/Components/Wrapped/localHours';

const empty = () => Array.from({ length: 12 }, () => new Array(96).fill(0));
const quarter = (hour, minute = 0) => hour * 4 + minute / 15;

describe('Wrapped local hours', function () {
    it('should leave UTC times alone with no offset', function () {
        const startTimes = empty();
        startTimes[0][quarter(20)] = 3;

        expect(localHours(startTimes, 2026, () => 0)[20]).toBe(3);
    });

    it("should use each month's own offset, for daylight saving", function () {
        const startTimes = empty();
        startTimes[0][quarter(20)] = 1; // January, UTC+0
        startTimes[6][quarter(20)] = 1; // July, UTC+1

        const hours = localHours(startTimes, 2026, (date) =>
            date.getUTCMonth() >= 3 && date.getUTCMonth() <= 9 ? 60 : 0
        );

        expect(hours[20]).toBe(1);
        expect(hours[21]).toBe(1);
    });

    it('should handle half and quarter hour timezones', function () {
        const startTimes = empty();
        startTimes[0][quarter(14, 45)] = 1;

        expect(localHours(startTimes, 2026, () => 5 * 60 + 30)[20]).toBe(1); // 20:15 in India
        expect(localHours(startTimes, 2026, () => 5 * 60 + 45)[20]).toBe(1); // 20:30 in Nepal
    });

    it('should wrap around midnight both ways', function () {
        const startTimes = empty();
        startTimes[0][quarter(23)] = 1;
        startTimes[0][quarter(1)] = 1;

        expect(localHours(startTimes, 2026, () => 120)[1]).toBe(1);
        expect(localHours(startTimes, 2026, () => -300)[20]).toBe(1);
    });
});
