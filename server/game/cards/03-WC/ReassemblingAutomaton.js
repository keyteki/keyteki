const Card = require('../../Card.js');

class ReassemblingAutomaton extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            condition: context => context.player.creaturesInPlay.length > 1,
            effect: 'heal all damage from {0}, exhaust it and move it to a flank',
            effectArgs: () => this,
            gameAction: [
                ability.actions.heal({ fully: true }),
                ability.actions.exhaust(),
                ability.actions.moveToFlank(),
                ability.actions.changeEvent(context => ({
                    event: context.event,
                    cancel: true,
                    postHandler: context => context.source.moribund = false
                }))
            ]
        });
    }
}

ReassemblingAutomaton.id = 'reassembling-automaton';

module.exports = ReassemblingAutomaton;
