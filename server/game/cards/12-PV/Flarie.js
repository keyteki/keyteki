const Card = require('../../Card.js');

class Flarie extends Card {
    // At the start of your turn, gain 1 amber.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

Flarie.id = 'flarie';

module.exports = Flarie;
