const Card = require('../../Card.js');

class Grondal extends Card {
    // Play: Make 2 token creatures.
    //
    // At the start of your turn, destroy the least powerful creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature({ amount: 2 })
        });

        this.reaction({
            when: {
                onBeginRound: (_, context) => context.player === this.game.activePlayer
            },
            target: {
                activePromptTitle: 'Choose a creature',
                cardType: 'creature',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Grondal.id = 'grondal';

module.exports = Grondal;
