const Card = require('../../Card.js');

class NeutronShark extends Card {
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
            effect: 'destroy {1}.{2}{3}{4}',
            effectArgs: context => {
                let result = [Object.values(context.targets)];
                if(context.player.deck.length > 0) {
                    result = result.concat([' Then, ', context.player.deck[0], ' is discarded from the top of their deck']);
                }
                return result;
            },
            gameAction: [
                ability.actions.discard(context => ({
                    target: context.player.deck.length > 0 ? context.player.deck[0] : []
                })),
                ability.actions.resolveAbility(context => ({
                    target: context.player.deck.length && !context.player.deck[0].hasHouse('logos') ? context.source : [],
                    ability: context.ability
                }))
            ]
        });
    }
}

NeutronShark.id = 'neutron-shark'; // This is a guess at what the id might be - please check it!!!

module.exports = NeutronShark;
