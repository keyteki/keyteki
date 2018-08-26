const Card = require('../../Card.js');

class WordOfReturning extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: [
                ability.actions.dealDamage(context => ({
                    target: context.player.opponent.cardsInPlay.filter(card => card.type === 'creature'),
                    amountForCard: card => card.amber
                })),
                ability.actions.returnAmber(context => ({
                    target: context.player.opponent.cardsInPlay.filter(card => card.type === 'creature')
                }))
            ]
        });
    }
}

WordOfReturning.id = 'word-of-returning'; // This is a guess at what the id might be - please check it!!!

module.exports = WordOfReturning;
