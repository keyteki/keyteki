const Card = require('../../Card.js');

class PuzzlingTrinket extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.mayResolveBonusIconsAs('capture', 'amber')
        });
        this.persistentEffect({
            effect: ability.effects.mayResolveBonusIconsAs('draw', 'amber')
        });
        this.persistentEffect({
            effect: ability.effects.mayResolveBonusIconsAs('damage', 'amber')
        });
    }
}

PuzzlingTrinket.id = 'puzzling-trinket';

module.exports = PuzzlingTrinket;
