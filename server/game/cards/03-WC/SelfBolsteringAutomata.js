const Card = require('../../Card.js');

class SelfBolsteringAutomata extends Card {
    // Destroyed: If you have any other creatures in play, instead of destroying Self-Bolstering Automata, fully heal it, exhaust it, and move it to a flank. If you do, give it two +1 power counters.
    setupCardAbilities() {
        this.destroyed({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            effect: 'replace its destruction',
            handler: (context) => {
                context.event.replacementHandler = (leavesPlayEvent) => {
                    const card = leavesPlayEvent.card;
                    const isReady = !card.exhausted;
                    const hasDamage = card.damage > 0;
                    context.game.addMessage(
                        '{0} uses {1} to fully heal it, exhaust it, and move it to a flank',
                        context.player,
                        context.source
                    );
                    context.game.actions
                        .sequential([
                            ...(isReady && hasDamage
                                ? [context.game.actions.addPowerCounter({ amount: 2 })]
                                : []),
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

SelfBolsteringAutomata.id = 'self-bolstering-automata';

module.exports = SelfBolsteringAutomata;
