import Card from '../../Card.js';

class PhoticRaider extends Card {
    // Play: Capture 2A.
    // (T) While the tide is high, Photic Raider gets +4 power.
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

export default PhoticRaider;
