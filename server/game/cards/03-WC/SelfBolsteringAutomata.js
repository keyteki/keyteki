const Card = require('../../Card.js');

class SelfBolsteringAutomata extends Card {
    // Destroyed: If you have any other creatures in play, instead of destroying Self-Bolstering Automata, fully heal it, exhaust it, and move it to a flank. If you do, give it two +1 power counters.
    setupCardAbilities() {
        this.destroyed({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            // Use handler rather than gameAction so we can install a replacementHandler
            // on the leavesPlay event. The replacement effect must not resolve during the
            // DestroyedAbilityWindow — it must wait until the window closes and the card
            // would actually be moved to the discard pile, per the rulebook rule for
            // destruction replacement effects.
            handler: (context) => {
                // Capture state now (before other Destroyed: abilities may change the card).
                const wasReady = !context.source.exhausted;
                const hadDamage = context.source.damage > 0;

                context.event.replacementHandler = (leavesPlayEvent) => {
                    const card = leavesPlayEvent.card;
                    card.moribund = false;
                    card.removeToken('damage');
                    card.exhausted = true;
                    if (wasReady && hadDamage) {
                        card.addToken('power', 2);
                    }
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
