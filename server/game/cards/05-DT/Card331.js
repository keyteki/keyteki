const Card = require('../../Card.js');

class Card331 extends Card {
    //Play: Discard the top 10 cards of your opponent's deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck.slice(
                    0,
                    Math.min(context.player.opponent.deck.length, 10)
                ),
                location: 'deck'
            }))
        });
    }
}

Card331.id = 'card-331';

module.exports = Card331;
