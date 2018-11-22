const Card = require('../../Card.js');

class StaunchKnight extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.isOnFlank(),
            effect: ability.effects.modifyPower(2)
        });
    }
}

StaunchKnight.id = 'staunch-knight'; // This is a guess at what the id might be - please check it!!!

module.exports = StaunchKnight;
