const Card = require('../../Card.js');

class ReassemblingAutomaton extends Card {
    // Destroyed: If you have any other creatures in play, instead of destroying Reassembling Automaton, fully heal it, exhaust it, and move it to a flank.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            effect: 'heal all damage from {0}, exhaust it and move it to a flank',
            effectArgs: () => this,
            gameAction: [
                ability.actions.heal({ fully: true }),
                ability.actions.exhaust(),
                ability.actions.moveToFlank(),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: true,
                    postHandler: (context) => (context.source.moribund = false)
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event.triggeringEvent,
                    cancel: true
                }))
            ]
        });
    }
}

ReassemblingAutomaton.id = 'reassembling-automaton';

module.exports = ReassemblingAutomaton;
