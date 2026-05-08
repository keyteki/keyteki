const Card = require('../../Card.js');

class QuixxleStone extends Card {
    // If a player has more creatures in play than their opponent, they cannot play creatures.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot('play', (context) => {
                if (context.source.type !== 'creature') {
                    return false;
                }

                const playerCreatures = context.player.cardsInPlay.filter(
                    (card) => card.type === 'creature'
                );
                const opponentCreatures = context.player.opponent
                    ? context.player.opponent.cardsInPlay.filter((card) => card.type === 'creature')
                    : [];

                return playerCreatures.length > opponentCreatures.length;
            })
        });
    }
}

QuixxleStone.id = 'quixxle-stone';

module.exports = QuixxleStone;
