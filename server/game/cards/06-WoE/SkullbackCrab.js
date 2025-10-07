import Card from '../../Card.js';

class SkullbackCrab extends Card {
    // Poison. (Any damage dealt by this creatures power during a fight destroys the damaged creature.)
    // Action: Steal 1.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

SkullbackCrab.id = 'skullback-crab';

export default SkullbackCrab;
