import Card from '../../Card.js';

class Gatewatcher extends Card {
    // Destroyed: If your opponent is haunted, destroy each enemy
    // flank creature.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => context.player.opponent && context.player.opponent.isHaunted(),
            gameAction: ability.actions.destroy((context) => ({
                target: context.player.opponent.creaturesInPlay.filter((c) => c.isOnFlank())
            }))
        });
    }
}

Gatewatcher.id = 'gatewatcher';

export default Gatewatcher;
