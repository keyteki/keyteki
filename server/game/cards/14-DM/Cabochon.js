const Card = require('../../Card.js');

class Cabochon extends Card {
    // Entrench.
    // At the start of your turn, if Cabochon is exhausted, gain 1 for each
    // friendly Skyborn flank creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) => context.player === this.game.activePlayer
            },
            condition: (context) => context.source.exhausted,
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.creaturesInPlay.filter(
                    (card) => card.hasHouse('skyborn') && card.isOnFlank()
                ).length
            }))
        });
    }
}

Cabochon.id = 'cabochon';

module.exports = Cabochon;
