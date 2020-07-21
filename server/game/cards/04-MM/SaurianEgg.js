const Card = require('../../Card.js');

class SaurianEgg extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.cardCannot('reap'), ability.effects.cardCannot('fight')]
        });

        this.omni({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, 2)
            })),
            then: {
                gameAction: ability.actions.sequentialForEach((context) => ({
                    forEach: context.preThenEvents
                        ? context.preThenEvents
                              .filter(
                                  (event) =>
                                      event.card.type === 'creature' &&
                                      event.card.hasHouse('saurian') &&
                                      !event.card.gigantic
                              )
                              .map((event) => event.card)
                        : [],
                    action: ability.actions.sequential([
                        ability.actions.putIntoPlay(),
                        ability.actions.ready(),
                        ability.actions.addPowerCounter({ amount: 3 })
                    ])
                })),
                then: {
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

SaurianEgg.id = 'saurian-egg';

module.exports = SaurianEgg;
