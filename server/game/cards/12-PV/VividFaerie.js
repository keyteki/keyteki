import Card from '../../Card.js';

class VividFaerie extends Card {
    // After Reap: Gain 1A for each of Vivid Faerie’s Untamed neighbors.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.source.neighbors.filter((card) => card.hasHouse('untamed')).length
            }))
        });
    }
}

VividFaerie.id = 'vivid-faerie';

export default VividFaerie;
