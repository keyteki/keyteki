const Card = require('../../Card.js');

class SirJaune extends Card {
    // Play: Capture one third of your opponent's (rounded down).
    // Fate: Lose one third of your (rounded down).
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                amount: Math.floor(context.player.opponent.amber / 3)
            }))
        });

        this.fate({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.game.activePlayer,
                amount: Math.floor(context.game.activePlayer.amber / 3)
            }))
        });
    }
}

SirJaune.id = 'sir-jaune';

module.exports = SirJaune;
