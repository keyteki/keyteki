const Card = require('../../Card.js');

class RogueOgre extends Card {
    // At the end of your turn, if you played exactly one card this turn, Rogue Ogre heals 2 damage and captures 1<A>.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) =>
                    context.player === this.game.activePlayer && this.game.cardsPlayed.length === 1
            },
            gameAction: [ability.actions.heal({ amount: 2 }), ability.actions.capture()]
        });
    }
}

RogueOgre.id = 'rogue-ogre';

module.exports = RogueOgre;
