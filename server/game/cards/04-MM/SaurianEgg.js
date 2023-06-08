const Card = require('../../Card.js');

class SaurianEgg extends Card {
    // Saurian Egg cannot fight or reap.
    // Omni: Discard the top 2 cards of your deck. If you discard any Saurian creatures this way, put them into play ready, give them three +1 power counters, and destroy Saurian Egg.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.cardCannot('reap'), ability.effects.cardCannot('fight')]
        });

        this.omni({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, 2)
            })),
            then: {
                gameAction: [
                    ability.actions.sequentialForEach((context) => {
                        let forEachCards = context.preThenEvents
                            ? context.preThenEvents
                                  .filter(
                                      (event) =>
                                          event.card.type === 'creature' &&
                                          event.card.hasHouse('saurian')
                                  )
                                  .map((event) => event.card)
                            : [];

                        if (forEachCards.length === 1) {
                            if (forEachCards[0].gigantic) {
                                forEachCards = [];
                            }
                        } else if (forEachCards.length === 2) {
                            if (forEachCards[0].gigantic) {
                                if (!forEachCards[1].gigantic) {
                                    forEachCards = [forEachCards[1]];
                                } else if (forEachCards[1].id === forEachCards[0].compositeId) {
                                    forEachCards = [forEachCards[0]];
                                } else {
                                    forEachCards = [];
                                }
                            } else if (forEachCards[1].gigantic) {
                                forEachCards = [forEachCards[0]];
                            }
                        }

                        return {
                            forEach: forEachCards,
                            action: ability.actions.sequential([
                                ability.actions.putIntoPlay(),
                                ability.actions.ready(),
                                ability.actions.addPowerCounter({ amount: 3 })
                            ])
                        };
                    }),
                    ability.actions.destroy((context) => ({
                        target:
                            context.preThenEvents &&
                            context.preThenEvents.filter(
                                (event) =>
                                    event.card.type === 'creature' && event.card.hasHouse('saurian')
                            ).length > 0
                                ? context.source
                                : null
                    }))
                ]
            }
        });
    }
}

SaurianEgg.id = 'saurian-egg';

module.exports = SaurianEgg;
