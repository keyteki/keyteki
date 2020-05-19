const Card = require('../../Card.js');

class KeyAbduction extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: "return all mars creatures to their owner's hand",
            gameAction: ability.actions.returnToHand((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse('mars'))
            })),
            then: {
                may: 'forge a key',
                alwaysTriggers: true,
                gameAction: ability.actions.forgeKey((context) => ({
                    modifier: 9 - context.player.hand.length
                }))
            }
        });
    }
}

KeyAbduction.id = 'key-abduction';

module.exports = KeyAbduction;
