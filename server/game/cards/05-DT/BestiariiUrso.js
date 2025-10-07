import Card from '../../Card.js';

class BestiariiUrso extends Card {
    // Play/Reap: You may unstun a creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.removeStun()
            }
        });
    }
}

BestiariiUrso.id = 'bestiarii-urso';

export default BestiariiUrso;
