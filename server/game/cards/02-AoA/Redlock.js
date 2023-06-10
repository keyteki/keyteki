const Card = require('../../Card.js');

class Redlock extends Card {
    // Skirmish.(When you use this creature to fight, it is dealt no damage in return.)
    // At the end of your turn, if you did not play any creatures this turn, gain 1A.
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
