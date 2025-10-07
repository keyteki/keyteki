import Card from '../../Card.js';

class AemberStorm extends Card {
    // Play: For each A in your pool, deal 1 D to an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to an enemy creature for each amber in their pool',
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.allocateDamage((context) => ({
                controller: 'opponent',
                numSteps: context.player.amber || 0
            }))
        });
    }
}

AemberStorm.id = 'æmber-storm';

export default AemberStorm;
