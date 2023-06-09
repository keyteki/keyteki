const Card = require('../../Card.js');

class Stampede extends Card {
    // Play: If you used 3 or more creatures this turn, steal 2<A>.
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
