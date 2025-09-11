const Card = require('../../Card.js');

class RazorsGambit extends Card {
    // Action: Ready and fight with a friendly Skyborn creature. If
    // your blue key is forged, repeat the preceding effect.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('skyborn'),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect: 'ready and fight with {0}',
            then: {
                condition: (context) => context.player.keys.blue,
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => card.hasHouse('skyborn'),
                    gameAction: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.fight()
                    ])
                },
                message: '{0} uses {1} to repeat the preceding effect and ready and fight with {3}',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

RazorsGambit.id = 'razor-s-gambit';

module.exports = RazorsGambit;
