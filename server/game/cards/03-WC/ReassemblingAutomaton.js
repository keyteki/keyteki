const Card = require('../../Card.js');

class ReassemblingAutomaton extends Card {
    // Destroyed: If you have any other creatures in play, instead of destroying Reassembling Automaton, fully heal it, exhaust it, and move it to a flank.
    setupCardAbilities() {
        this.destroyed({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            effect: 'replace its destruction',
            handler: (context) => {
                context.event.replacementHandler = (leavesPlayEvent) => {
                    const card = leavesPlayEvent.card;
                    context.game.addMessage(
                        '{0} uses {1} to fully heal it, exhaust it, and move it to a flank',
                        context.player,
                        context.source
                    );
                    context.game.actions
                        .sequential([
                            context.game.actions.heal({ fully: true }),
                            context.game.actions.exhaust(),
                            context.game.actions.moveToFlank()
                        ])
                        .resolve(card, context);
                };
            }
        });
    }
}

ReassemblingAutomaton.id = 'reassembling-automaton';

module.exports = ReassemblingAutomaton;
