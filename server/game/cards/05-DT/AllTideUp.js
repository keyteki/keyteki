const Card = require('../../Card.js');

class AllTideUp extends Card {
    //Play: If the tide is high, gain 1A. Otherwise, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isTideHigh(),
                trueGameAction: ability.actions.gainAmber({ amount: 1 }),
                falseGameAction: ability.actions.raiseTide()
            })
        });
    }
}

AllTideUp.id = 'all-tide-up';

module.exports = AllTideUp;
