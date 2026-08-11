const Card = require('../../Card.js');

class ReassemblingAutomaton extends Card {
    // Destroyed: If you have any other creatures in play, instead of destroying Reassembling Automaton, fully heal it, exhaust it, and move it to a flank.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            effect: 'heal all damage from {0}, exhaust it and move it to a flank',
            effectArgs: () => this,
            gameAction: ability.actions.replaceDestruction({
                gameAction: [
                    ability.actions.heal({ fully: true }),
                    ability.actions.exhaust(),
                    ability.actions.moveToFlank()
                ]
            })
        });
    }
}

ReassemblingAutomaton.id = 'reassembling-automaton';

module.exports = ReassemblingAutomaton;
