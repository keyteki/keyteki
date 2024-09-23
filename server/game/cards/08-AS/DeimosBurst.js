const Card = require('../../Card.js');

class DeimosBurst extends Card {
    // Play: Destroy each friendly artifact and each friendly flank
    // creature. Gain 1A for each card destroyed this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.player.cardsInPlay.filter(
                    (card) =>
                        card.type === 'artifact' || (card.type === 'creature' && card.isOnFlank())
                )
            })),
            then: {
                alwaysTriggers: true,
                message:
                    '{0} uses {1} to destroy all of their artifacts and flank creatures and gain {3} amber',
                messageArgs: (context) => [
                    context.preThenEvents.filter((event) => !event.cancelled).length
                ],
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvents.filter((event) => !event.cancelled).length
                }))
            }
        });
    }
}

DeimosBurst.id = 'deimos-burst';

module.exports = DeimosBurst;
