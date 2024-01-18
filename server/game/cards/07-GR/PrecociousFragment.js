const Card = require('../../Card.js');

class PrecociousFragment extends Card {
    // After Reap: If you are haunted, gain 1. Otherwise, discard the
    // top card of your deck.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isHaunted(),
                trueGameAction: ability.actions.gainAmber(),
                falseGameAction: ability.actions.discard((context) => ({
                    target: context.player.deck.slice(0, 1)
                }))
            }),
            effect: '{1}',
            effectArgs: (context) => [
                context.player.isHaunted() ? 'gain 1 amber' : 'discard the top card of their deck'
            ]
        });
    }
}

PrecociousFragment.id = 'precocious-fragment';

module.exports = PrecociousFragment;
