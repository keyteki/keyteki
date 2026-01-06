const Card = require('../../Card.js');

class RaceToTheSurface extends Card {
    // Play: Discard the top 5 cards of your deck. Archive each Keyraken card discarded this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, 5)
            })),
            then: {
                gameAction: ability.actions.archive((context) => ({
                    target: context.preThenEvents
                        .filter((event) => !event.cancelled && event.card.hasHouse('keyraken'))
                        .map((event) => event.card)
                }))
            }
        });
    }
}

RaceToTheSurface.id = 'race-to-the-surface';

module.exports = RaceToTheSurface;
