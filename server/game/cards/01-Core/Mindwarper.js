import Card from '../../Card.js';

class Mindwarper extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Action: Choose an enemy creature.
    // It captures 1A from its own side.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.capture((context) => ({
                    player: context.player.opponent
                }))
            }
        });
    }
}

Mindwarper.id = 'mindwarper';

export default Mindwarper;
