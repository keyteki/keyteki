const Card = require('../../Card.js');

class PourTal extends Card {
    // (T) Play: If the tide is high, archive Pour-tal. Otherwise, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isTideHigh(),
                trueGameAction: ability.actions.archive((context) => ({
                    target: context.source
                })),
                falseGameAction: ability.actions.raiseTide()
            })
        });
    }
}

PourTal.id = 'pour-tal';

module.exports = PourTal;
