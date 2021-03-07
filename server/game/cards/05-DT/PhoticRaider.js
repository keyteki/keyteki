const Card = require('../../Card.js');

class PhoticRaider extends Card {
    //Play: Capture 2A.
    //If the tide is high, $this gets +4 power.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 2 })
        });
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.modifyPower(() => 4)
        });
    }
}

PhoticRaider.id = 'photic-raider';

module.exports = PhoticRaider;
