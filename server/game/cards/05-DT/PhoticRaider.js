const Card = require('../../Card.js');

class PhoticRaider extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 2 })
        });

        this.persistentEffect({
            condition: (context) => context.source.controller.isTideHigh(),
            effect: ability.effects.modifyPower(4)
        });
    }
}

PhoticRaider.id = 'photic-raider';

module.exports = PhoticRaider;
