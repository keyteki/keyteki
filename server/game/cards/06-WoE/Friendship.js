const Card = require('../../Card.js');

class Friendship extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageApplied: (event, context) =>
                    event.card === context.source.parent &&
                    context.source.parent.neighbors.length > 0 &&
                    event.amount > 0
            },
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                cancel: true,
                postHandler: () => {
                    let neighbors = context.source.parent.neighbors;
                    let damage = context.event.amount;
                    let damagePerNeighbor = Math.floor(damage / neighbors.length);
                    let remainder = damage % neighbors.length;

                    // Add the evenly-split damage.
                    ability.actions
                        .addDamageToken({
                            noGameStateCheck: true,
                            amount: damagePerNeighbor
                        })
                        .resolve(neighbors, context);

                    if (remainder > 0) {
                        // Ask the player which neighbor should receive the extra damage
                        context.game.promptForSelect(context.game.activePlayer, {
                            activePromptTitle: 'Select a neighbor to receive extra damage',
                            source: context.source,
                            cardCondition: (card) => neighbors.includes(card),
                            onSelect: (player, card) => {
                                ability.actions
                                    .addDamageToken({
                                        amount: damagePerNeighbor
                                    })
                                    .resolve(card, context);
                                return true;
                            }
                        });
                    }
                }
            }))
        });
    }
}

Friendship.id = 'friendship';

module.exports = Friendship;
