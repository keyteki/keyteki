const Card = require('../../Card.js');

class SeaUrchinEvilTwin extends Card {
    // (T) Play: Capture 2A. If the tide is high, steal 2A instead.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional((context) => ({
                condition: () => context.player.isTideHigh(),
                trueGameAction: ability.actions.steal({ amount: 2 }),
                falseGameAction: ability.actions.capture({ amount: 2 })
            })),
            effect: '{1}',
            effectArgs: (context) =>
                context.player.isTideHigh() ? 'steal 2 amber' : 'capture 2 amber'
        });
    }
}

SeaUrchinEvilTwin.id = 'sea-urchin-evil-twin';

module.exports = SeaUrchinEvilTwin;
