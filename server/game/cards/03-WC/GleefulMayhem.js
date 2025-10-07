import Card from '../../Card.js';
import Constants from '../../../constants.js';
const { Houses } = Constants;

class GleefulMayhem extends Card {
    // Play: For each house, deal 5D to a creature of that house.
    setupCardAbilities(ability) {
        const targets = {};
        for (const house of Houses) {
            targets[house] = {
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse(house),
                gameAction: ability.actions.dealDamage({ amount: 5 })
            };
        }

        this.play({
            targets: targets,
            effect: 'deal 5 damage to {1}',
            effectArgs: (context) => [Object.values(context.targets)]
        });
    }
}

GleefulMayhem.id = 'gleeful-mayhem';

export default GleefulMayhem;
