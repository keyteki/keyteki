import Card from '../../Card.js';

class ReveredMonk extends Card {
    // Revered Monk gets +2 armor for each of its sanctum neighbors
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyArmor(
                (card) => card.neighbors.filter((c) => c.hasHouse('sanctum')).length * 2
            )
        });
    }
}

ReveredMonk.id = 'revered-monk';

export default ReveredMonk;
