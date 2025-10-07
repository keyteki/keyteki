import Card from '../../Card.js';

class RedAmberdrake extends Card {
    // Destroyed: Gain 4A. Forge your red key at current cost.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.gainAmber({ amount: 4 }),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.forgeKey({ keyColor: 'red' })
            }
        });
    }
}

RedAmberdrake.id = 'red-æmberdrake';

export default RedAmberdrake;
