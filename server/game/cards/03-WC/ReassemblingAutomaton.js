const Card = require('../../Card.js');

class ReassemblingAutomaton extends Card {
    // Destroyed: If you have any other creatures in play, instead of destroying Reassembling Automaton, fully heal it, exhaust it, and move it to a flank.
    setupCardAbilities() {
        this.destroyed({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            handler: (context) => {
                context.event.replacementHandler = (leavesPlayEvent) => {
                    const card = leavesPlayEvent.card;
                    card.moribund = false;
                    card.removeToken('damage');
                    card.exhausted = true;
                    context.game.addMessage(
                        '{0} uses {1} to fully heal it, exhaust it, and move it to a flank',
                        context.player,
                        context.source
                    );
                    context.game.actions.moveToFlank().resolve(card, context);
                };
            }
        });
    }
}

ReassemblingAutomaton.id = 'reassembling-automaton';

module.exports = ReassemblingAutomaton;
