const Card = require('../../Card.js');

class Ransack extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal(),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) => context.player.deck.length > 0,
                message: '{0} discards the top card of their deck due to {1}: {3}{4}{5}{6}',
                messageArgs: (context) => {
                    let topCard = context.player.deck[0];
                    if (topCard) {
                        if (
                            !topCard.hasHouse('shadows') ||
                            context.source.location !== 'being played'
                        ) {
                            return [topCard];
                        }

                        return [topCard, '. ', context.source, "'s ability resolves again"];
                    }

                    return [];
                },
                gameAction: [
                    ability.actions.discard((context) => ({
                        target: context.player.deck.length > 0 ? context.player.deck[0] : []
                    })),
                    ability.actions.resolveAbility((context) => ({
                        target:
                            context.source.location === 'being played' &&
                            context.player.deck.length &&
                            context.player.deck[0].hasHouse('shadows')
                                ? context.source
                                : [],
                        ability: preThenContext.ability
                    }))
                ]
            })
        });
    }
}

Ransack.id = 'ransack';

module.exports = Ransack;
