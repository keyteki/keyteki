import Card from '../../Card.js';

class EnchantedMurmook extends Card {
    // Enhance .
    // Your opponent's keys cost +1 for each of Enchanted Murmook's Untamed neighbors.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost((player, context) => {
                const untamedNeighbors = context.source.neighbors.filter((neighbor) =>
                    neighbor.hasHouse('untamed')
                );
                return untamedNeighbors.length;
            })
        });
    }
}

EnchantedMurmook.id = 'enchanted-murmook';

export default EnchantedMurmook;
