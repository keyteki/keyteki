const Card = require('../../Card.js');

class GreyMonk extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyArmor(1)
        });
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 2 })
            }
        });
    }
}

GreyMonk.id = 'grey-monk'; // This is a guess at what the id might be - please check it!!!

module.exports = GreyMonk;
