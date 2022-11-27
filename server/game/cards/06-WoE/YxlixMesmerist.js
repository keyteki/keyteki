const Card = require('../../Card.js');

class YxlixMesmerist extends Card {
    //Action: A creature captures 1A from its own side.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.capture((context) => ({
                    amount: 1,
                    player: context.target.controller
                }))
            }
        });
    }
}

YxlixMesmerist.id = 'yxlix-mesmerist';

module.exports = YxlixMesmerist;
