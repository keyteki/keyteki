const { readSqlFiles } = require('../../server/db/sqlFiles');
const { DominantWinSql, isDominantWin, MinTurns } = require('../../server/services/DominantWin');

const normalise = (sql) => sql.replace(/\s+/g, ' ');

describe('Dominant wins', function () {
    it('should be counted the same way by the latest DeckStats view definition', function () {
        const definitions = readSqlFiles().filter(({ sql }) =>
            sql.includes('CREATE MATERIALIZED VIEW public."DeckStats"')
        );

        expect(definitions.length).toBeGreaterThan(0);
        expect(normalise(definitions[definitions.length - 1].sql)).toContain(
            normalise(DominantWinSql)
        );
    });

    it('should count a win by keys or concession with the opponent on no keys', function () {
        expect(isDominantWin({ Won: true, WinReason: 'keys', Turn: MinTurns })).toBe(true);
        expect(isDominantWin({ Won: true, WinReason: 'concede', Turn: 8, OpponentKeys: 0 })).toBe(
            true
        );
    });

    it('should not count losses, other win reasons, short games or opponents with keys', function () {
        const win = { Won: true, WinReason: 'keys', Turn: 6, OpponentKeys: 0 };

        expect(isDominantWin({ ...win, Won: false })).toBe(false);
        expect(isDominantWin({ ...win, WinReason: 'clock' })).toBe(false);
        expect(isDominantWin({ ...win, Turn: MinTurns - 1 })).toBe(false);
        expect(isDominantWin({ ...win, Turn: null })).toBe(false);
        expect(isDominantWin({ ...win, OpponentKeys: 1 })).toBe(false);
    });
});
