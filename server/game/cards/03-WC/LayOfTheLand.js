const Card = require('../../Card.js');

class LayOfTheLand extends Card {
    // Play: Look at the top 3 cards of your deck and put them back in any order. Draw a card.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'look at the top 3 cards of their deck, rearrange them in any order, and draw 1 card',
            gameAction: ability.actions.sequential([
                ability.actions.rearrangeCards({ amount: 3 }),
                ability.actions.draw()
            ])
        });
    }
}

LayOfTheLand.id = 'lay-of-the-land';

module.exports = LayOfTheLand;
