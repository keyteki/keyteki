const Card = require('../../Card.js');

class WatneysCalculation extends Card {
    // Play: If your opponent has more A than you, destroy an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.amber > context.player.amber,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

WatneysCalculation.id = 'watney-s-calculation';

module.exports = WatneysCalculation;
