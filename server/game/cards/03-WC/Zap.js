const Card = require('../../Card.js');

class Zap extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.sequentialForEach(context => ({
                num: context.game.getHousesInPlay(context.game.creaturesInPlay).length,
                action: ability.actions.dealDamage({
                    noGameStateCheck: true,
                    amount: 1,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to deal 1 damage to',
                        cardType: 'creature'
                    }
                })
            }))
        });
    }
}
Zap.id = 'zap';

module.exports = Zap;
