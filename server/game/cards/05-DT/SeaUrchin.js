const Card = require('../../Card.js');

class SeaUrchin extends Card {
    // Poison.  (Any damage dealt by this creature’s power during a fight destroys the damaged creature.)
    // (T) Play: Capture 1A. If the tide is high, steal 1A instead.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional((context) => ({
                condition: () => context.player.isTideHigh(),
                trueGameAction: ability.actions.steal(),
                falseGameAction: ability.actions.capture()
            })),
            effect: '{1}',
            effectArgs: (context) =>
                context.player.isTideHigh() ? 'steal 1 amber' : 'capture 1 amber'
        });
    }
}

SeaUrchin.id = 'sea-urchin';

module.exports = SeaUrchin;
