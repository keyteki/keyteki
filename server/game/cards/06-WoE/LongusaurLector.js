import Card from '../../Card.js';

class LongusaurLector extends Card {
    // Play/After Reap: You may exalt Longusaur Lector. If you do, make a token creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a token creature'
            }
        });
    }
}

LongusaurLector.id = 'longusaur-lector';

export default LongusaurLector;
