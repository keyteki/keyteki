const Card = require('../../Card.js');

class LokTheCorruptor extends Card {
    // Enhance .
    // After Reap: Your opponent loses 1 for each friendly Dis creature in play.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player.opponent,
                amount: context.player.cardsInPlay.filter(
                    (card) => card.type === 'creature' && card.hasHouse('dis')
                ).length
            }))
        });
    }
}

LokTheCorruptor.id = 'lok-the-corruptor';

module.exports = LokTheCorruptor;
