const Card = require('../../Card.js');

class NeutronShark extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            targets: {
                enemy: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.destroy()
                },
                friendly: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.destroy()
                }
            },
            effect: 'destroy {1}',
            effectArgs: context => [Object.values(context.targets)],
            gameAction: ability.actions.discard(context => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : []
            })),
            then: preThenContext => ({
                alwaysTriggers: true,
                condition: context => context.preThenEvents.some(event => event.gameAction.title === 'discard'),
                gameAction: ability.actions.resolveAbility({ ability: preThenContext.ability })
            })
        });
    }
}

NeutronShark.id = 'neutron-shark'; // This is a guess at what the id might be - please check it!!!

module.exports = NeutronShark;
