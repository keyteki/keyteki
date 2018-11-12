const Card = require('../../Card.js');

class RogueOgre extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) => 
                    event.phase === 'draw' && context.player === this.game.activePlayer &&
                    this.game.cardsPlayed.length === 1
            },
            gameAction: [
                ability.actions.heal({ amount: 2}),
                ability.actions.capture()
            ]
        });
    }
}

RogueOgre.id = 'rogue-ogre'; // This is a guess at what the id might be - please check it!!!

module.exports = RogueOgre;
