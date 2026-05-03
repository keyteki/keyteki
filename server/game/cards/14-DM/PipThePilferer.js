const Card = require('../../Card.js');

class PipThePilferer extends Card {
    // Play: If your opponent has more forged keys than you, steal 2A. Otherwise, capture 2A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional((context) => ({
                condition:
                    context.player.opponent &&
                    context.player.opponent.getForgedKeys() > context.player.getForgedKeys(),
                trueGameAction: ability.actions.steal({ amount: 2 }),
                falseGameAction: ability.actions.capture({ amount: 2, target: context.source })
            })),
            effect: 'steal or capture 2 amber'
        });
    }
}

PipThePilferer.id = 'pip-the-pilferer';

module.exports = PipThePilferer;
