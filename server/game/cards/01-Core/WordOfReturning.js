const Card = require('../../Card.js');

class WordOfReturning extends Card {
    // Play: Deal 1<D> to each enemy creature for each <A> on it. Return all <A> from those creatures to your pool.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'deal damage to enemy creatures and take their amber',
            gameAction: ability.actions.sequential([
                ability.actions.dealDamage((context) => ({
                    target: context.player.opponent.cardsInPlay.filter(
                        (card) => card.type === 'creature'
                    ),
                    amountForCard: (card) => card.amber
                })),
                ability.actions.returnAmber((context) => ({
                    target: context.player.opponent.cardsInPlay.filter(
                        (card) => card.type === 'creature'
                    ),
                    all: true
                }))
            ])
        });
    }
}

WordOfReturning.id = 'word-of-returning';

module.exports = WordOfReturning;
