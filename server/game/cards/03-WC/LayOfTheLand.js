const Card = require('../../Card.js');

class LayOfTheLand extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.rearrangeCards({ amount: 3 }),
            effect: 'look at the top 3 cards of their deck, rearrange them in any order, and draw 1 card',
            then: {
                gameAction: ability.actions.draw()
            }
        });
    }
}

LayOfTheLand.id = 'lay-of-the-land';

module.exports = LayOfTheLand;
