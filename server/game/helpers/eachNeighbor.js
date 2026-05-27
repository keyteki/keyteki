/**
 * Helper that builds the `effect`, `target` and `then` properties for the
 * common "do something with each of this card's neighbors, one at a time"
 * pattern.
 *
 * Used by Ghosthawk (Play: reap with each neighbor),
 * Prof. Emeritus Kering ((T) Play/Fight/Reap: use one neighbor, if tide high
 * also use the other) and Badgemagus (Fight: ready and fight with each
 * neighbor).
 *
 * The second neighbor is selected directionally: whichever side the first
 * target was on, the opposite side's current occupant is chosen. This works
 * even after a swap (same card now on the other side is reused) and after
 * the source leaves play (Card.leftNeighbor / Card.rightNeighbor fall back
 * to the directional pre-leave snapshots).
 *
 * @param {Object} props
 * @param {string} props.effect - effect text used by the ability log
 * @param {(propsOrFactory: any) => any} props.gameAction -
 *        Called twice. First with no argument to build the action for the
 *        player-chosen neighbor (inherits the outer target). Second with a
 *        props factory `(context) => ({ target })` that picks the opposite
 *        side neighbor.
 * @param {boolean} [props.optional=false] - whether the first neighbor is optional ("you may")
 * @param {(context: any) => boolean} [props.secondCondition] - optional gating condition
 *        evaluated on the then-context before resolving the second neighbor
 *        (e.g. Kering's "if the tide is high")
 * @returns {Object} an object to merge into a `play()` / `fight()` / `reap()` ability config
 */
function eachNeighbor({ effect, gameAction, optional = false, secondCondition }) {
    return {
        effect,
        target: {
            optional,
            cardType: 'creature',
            cardCondition: (card, context) => context.source.neighbors.includes(card),
            gameAction: gameAction()
        },
        then: (preThenContext) => {
            const firstWasLeft = preThenContext.source.leftNeighbor() === preThenContext.target;
            return {
                alwaysTriggers: true,
                condition: (context) => {
                    if (!preThenContext.target) {
                        return false;
                    }
                    if (secondCondition && !secondCondition(context)) {
                        return false;
                    }
                    return true;
                },
                gameAction: gameAction(() => ({
                    target: firstWasLeft
                        ? preThenContext.source.rightNeighbor()
                        : preThenContext.source.leftNeighbor()
                }))
            };
        }
    };
}

module.exports = { eachNeighbor };
