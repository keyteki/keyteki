const Card = require('../../Card.js');

class Redlock extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) =>
                    context.player === this.game.activePlayer &&
                    this.game.cardsPlayed.filter((card) => card.type === 'creature').length === 0
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

Redlock.id = 'redlock';

module.exports = Redlock;
