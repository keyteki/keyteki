const Card = require('../../Card.js');
const Houses = require('../../../constants').Houses;

class GleefulMayhem extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequentialForEach(({
                forEach: Houses,
                action: house => ability.actions.dealDamage(({
                    amount: 5,
                    noGameStateCheck: true,
                    promptForSelect: {
                        activePromptTitle: `Choose a creature of house ${house} to deal 5 damage to`,
                        cardType: 'creature',
                        cardCondition: card => card.hasHouse(house)
                    }
                }))
            }))
        });
    }
}

GleefulMayhem.id = 'gleeful-mayhem';

module.exports = GleefulMayhem;
