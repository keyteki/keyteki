// A dominant win is a win by keys or concession, after enough turns that the opponent had a chance, with the
// opponent on 0 keys. Deck records (the DeckStats view), user stats and Wrapped all use this rule;
// DominantWin.spec.js checks the view still matches it.

const MinTurns = 3;
const WinReasons = ['keys', 'concede'];

/**
 * The rule as an SQL condition, for a query with the player's GamePlayers row as `gp`, their opponent's as
 * `opp` and the game as `g`
 */
const DominantWinSql =
    'gp."PlayerId" = g."WinnerId" ' +
    `AND g."WinReason" IN (${WinReasons.map((reason) => `'${reason}'`).join(', ')}) ` +
    `AND COALESCE(gp."Turn", 0) >= ${MinTurns} ` +
    'AND COALESCE(opp."Keys", 0) = 0';

/**
 * @param {{Won: boolean, WinReason?: string, Turn?: number, OpponentKeys?: number}} game
 */
function isDominantWin(game) {
    return (
        !!game.Won &&
        WinReasons.includes(game.WinReason) &&
        (game.Turn || 0) >= MinTurns &&
        (game.OpponentKeys || 0) === 0
    );
}

module.exports = { DominantWinSql, isDominantWin, MinTurns, WinReasons };
