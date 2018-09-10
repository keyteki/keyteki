const Card = require('../../Card.js');

class HallowedBlaster extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 3 })
            }
        });
    }
}

HallowedBlaster.id = 'hallowed-blaster'; // This is a guess at what the id might be - please check it!!!

module.exports = HallowedBlaster;
