const Card = require('../../Card.js');

class QuixxleStone extends Card {
    // If a player has more creatures in play than their opponent, they cannot play creatures.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => {
                let currentPlayerCreatures = this.game.activePlayer.cardsInPlay.filter(
                    (card) => card.type === 'creature'
                );
                let opponentCreatures = this.game.activePlayer.opponent
                    ? this.game.activePlayer.opponent.cardsInPlay.filter(
                          (card) => card.type === 'creature'
                      )
                    : [];
                return currentPlayerCreatures.length > opponentCreatures.length;
            },
            targetController: 'any',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability.title === 'Play this creature'
            )
        });
    }
}

QuixxleStone.id = 'quixxle-stone';

module.exports = QuixxleStone;
