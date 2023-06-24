const Card = require('../../Card.js');

class Flaxia extends Card {
    // Play: Gain 2A if you control more creatures than your opponent.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.cardsInPlay.filter((card) => card.type === 'creature').length >
                    context.player.opponent.cardsInPlay.filter((card) => card.type === 'creature')
                        .length,
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

Flaxia.id = 'flaxia';

module.exports = Flaxia;
