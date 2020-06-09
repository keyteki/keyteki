const Card = require('../../Card.js');

class HuggerMugger extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 1 }),
            then: {
                condition: (context) =>
                    context.player.opponent &&
                    context.player.opponent.getForgedKeys() > context.player.getForgedKeys(),
                effect: 'steal 1 amber',
                gameAction: ability.actions.steal()
            }
        });
    }
}

HuggerMugger.id = 'hugger-mugger';

module.exports = HuggerMugger;
