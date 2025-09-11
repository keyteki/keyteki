const Card = require('../../Card.js');

class ProtectivePlaymate extends Card {
    // While you are haunted, Protective Playmate gets +6
    // power. Otherwise, Protective Playmate gains elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            effect: ability.effects.modifyPower(6)
        });

        this.persistentEffect({
            condition: (context) => !context.source.controller.isHaunted(),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

ProtectivePlaymate.id = 'protective-playmate';

module.exports = ProtectivePlaymate;
