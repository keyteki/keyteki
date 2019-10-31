const Card = require('../../Card.js');

class QuixxleStone extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => {
                let currentPlayerCreatures = this.controller.game.activePlayer.cardsInPlay.filter(card => card.type === 'creature');
                let opponentCreatures = this.controller.game.activePlayer.opponent.cardsInPlay.filter(card => card.type === 'creature');
                return currentPlayerCreatures.length > opponentCreatures.length;
            },
            targetController: 'any',
            effect: ability.effects.playerCannot('play', context => context.source.type === 'creature')
        });
    }
}

QuixxleStone.id = 'quixxle-stone';

module.exports = QuixxleStone;
