import Card from '../../Card.js';

class RantAndRive extends Card {
    // Play: If your opponent has 8 or more, they lose half their  (rounding down the loss).
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 8,
            gameAction: ability.actions.loseAmber((context) => ({
                amount: Math.floor(context.player.opponent.amber / 2)
            }))
        });
    }
}

RantAndRive.id = 'rant-and-rive';

export default RantAndRive;
