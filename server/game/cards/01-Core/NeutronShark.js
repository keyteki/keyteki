const Card = require('../../Card.js');

class NeutronShark extends Card {
    // Play/Fight/Reap: Destroy an enemy creature or artifact and a friendly creature or artifact. Discard the top card of your deck. If that card is not a Logos card, trigger this effect again.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            targets: {
                enemy: {
                    cardType: ['creature', 'artifact'],
                    controller: 'opponent',
                    gameAction: ability.actions.destroy()
                },
                friendly: {
                    cardType: ['creature', 'artifact'],
                    controller: 'self',
                    gameAction: ability.actions.destroy()
                }
            },
            effect: 'destroy {1}',
            effectArgs: (context) => [Object.values(context.targets)],
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) => context.player.deck.length > 0,
                message: '{0} discards the top card of their deck due to {1}: {3}{4}{5}{6}',
                messageArgs: (context) => {
                    let topCard = context.player.deck[0];
                    if (topCard) {
                        if (topCard.hasHouse('logos') || context.source.location !== 'play area') {
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
                            context.source.location === 'play area' &&
                            context.player.deck.length &&
                            !context.player.deck[0].hasHouse('logos')
                                ? context.source
                                : [],
                        ability: preThenContext.ability
                    }))
                ]
            })
        });
    }
}

NeutronShark.id = 'neutron-shark';

module.exports = NeutronShark;
