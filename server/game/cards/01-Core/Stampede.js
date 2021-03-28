const Card = require('../../Card.js');

class Stampede extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.cardsUsed.filter((card) => card.type === 'creature').length >= 3,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

Stampede.id = 'stampede';

module.exports = Stampede;
