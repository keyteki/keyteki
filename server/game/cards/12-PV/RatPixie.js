import Card from '../../Card.js';

class RatPixie extends Card {
    // Play/After Reap: If you have 4A or fewer, gain 1A.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            condition: (context) => context.player.amber <= 4,
            gameAction: ability.actions.gainAmber()
        });
    }
}

RatPixie.id = 'rat-pixie';

export default RatPixie;
