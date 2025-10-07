import Card from '../../Card.js';

class QuantumMouse extends Card {
    // When you would resolve a draw bonus icon, you may choose to
    // resolve it as a discard bonus icon instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.mayResolveBonusIconsAs('discard', 'draw')
        });
    }
}

QuantumMouse.id = 'quantum-mouse';

export default QuantumMouse;
