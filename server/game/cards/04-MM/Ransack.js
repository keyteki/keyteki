const Card = require('../../Card.js');

class Ransack extends Card {
    // Play: Steal 1. Discard the top card of your deck. If that card is a Shadows card, trigger this effect again.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.steal(),
                ability.actions.discard((context) => ({
                    target: context.player.deck.length ? context.player.deck[0] : null
                }))
            ],
            effectStyle: 'append',
            then: (preThenContext) => ({
                alwaysTriggers: true,
                message: '{0} uses {1} to resolve its effect again',
                gameAction: ability.actions.resolveAbility((context) => {
                    let event = context.preThenEvents.find((event) => !!event.card);
                    return {
                        target:
                            context.source.location === 'being played' &&
                            event &&
                            event.card.hasHouse('shadows')
                                ? context.source
                                : [],
                        ability: preThenContext.ability
                    };
                })
            })
        });
    }
}

Ransack.id = 'ransack';

module.exports = Ransack;
