const Card = require('../../Card.js');

class ConsulPrimus extends Card {
    setupCardAbilities(ability) {
        this.reap({
            condition: context => context.game.creaturesInPlay.length > 1,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.removeAmber()
            },
            then: preContext => ({
                gameAction: ability.actions.placeAmber({
                    promptForSelect: {
                        message: '{0} uses {1} to place 1 amber on {2}',
                        messageArgs: card => [preContext.player, preContext.source, card],
                        cardType: 'creature',
                        activePromptTitle: 'Choose another creature',
                        cardCondition: card => card !== preContext.target
                    }
                })
            })
        });
    }
}

ConsulPrimus.id = 'consul-primus';

module.exports = ConsulPrimus;
