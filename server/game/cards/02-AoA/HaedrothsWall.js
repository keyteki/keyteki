const Card = require('../../Card.js');

class HaedrothsWall extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.type === 'creature' && card.isOnFlank(),
            effect: ability.effects.modifyPower(2)
        });
    }
}

HaedrothsWall.id = 'haedroth-s-wall';

module.exports = HaedrothsWall;
