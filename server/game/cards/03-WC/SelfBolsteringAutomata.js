const Card = require('../../Card.js');

class SelfBolsteringAutomata extends Card {
    // Destroyed: If you have any other creatures in play, instead of destroying Self-Bolstering Automata, fully heal it, exhaust it, and move it to a flank. If you do, give it two +1 power counters.
    setupCardAbilities() {
        this.destroyed({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            handler: (context) => {
                context.event.replacementHandler = (leavesPlayEvent) => {
                    const card = leavesPlayEvent.card;
                    const isReady = !context.source.exhausted;
                    const hasDamage = context.source.damage > 0;
                    if (isReady && hasDamage) {
                        card.addToken('power', 2);
                    }
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

SelfBolsteringAutomata.id = 'self-bolstering-automata';

module.exports = SelfBolsteringAutomata;
