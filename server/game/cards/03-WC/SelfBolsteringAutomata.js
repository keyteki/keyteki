const Card = require('../../Card.js');
const ThenAbility = require('../../ThenAbility.js');

class SelfBolsteringAutomata extends Card {
    // Destroyed: If you have any other creatures in play, instead of destroying Self-Bolstering Automata, fully heal it, exhaust it, and move it to a flank. If you do, give it two +1 power counters.
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
                    const { actions } = context.game;
                    const replacement = new ThenAbility(context.game, context.source, {
                        gameAction: [
                            actions.heal({ fully: true, target: card }),
                            actions.exhaust({ target: card }),
                            actions.moveToFlank({ target: card })
                        ],
                        then: {
                            // Only if the heal, exhaust and move to flank all happened.
                            condition: (thenContext) => thenContext.preThenEvents.length === 3,
                            gameAction: actions.addPowerCounter({ amount: 2, target: card })
                        }
                    });
                    context.game.queueSimpleStep(() => replacement.executeHandler(context));
                };
            }
        });
    }
}

SelfBolsteringAutomata.id = 'self-bolstering-automata';

module.exports = SelfBolsteringAutomata;
