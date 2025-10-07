import Card from '../../Card.js';

class PuzzlingTrinket extends Card {
    // Enhance . (These icons have already been added to cards in your deck.)
    // When you resolve an  bonus icon, you may choose to resolve it as a , , or  icon instead.
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

export default PuzzlingTrinket;
