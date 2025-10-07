import Card from '../../Card.js';

class Murmook extends Card {
    // Your opponents keys cost +1<A>.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(1)
        });
    }
}

Murmook.id = 'murmook';

export default Murmook;
