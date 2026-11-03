const fs = require('fs');
const path = require('path');

const { DominantWinSql, isDominantWin, MinTurns } = require('../../server/services/DominantWin');

const normalise = (sql) => sql.replace(/\s+/g, ' ');

describe('Dominant wins', function () {
    it('should be counted by the DeckStats view the same way, in the schema and the migration', function () {
        for (const file of ['25 - DeckStats.sql', 'migrations/25 - DeckRecords.sql']) {
            const sql = fs.readFileSync(
                path.join(__dirname, '../../server/db/schema', file),
                'utf8'
            );

            expect(normalise(sql)).toContain(normalise(DominantWinSql));
        }
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
