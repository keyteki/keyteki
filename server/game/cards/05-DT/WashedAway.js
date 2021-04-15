const Card = require('../../Card.js');

class WashedAway extends Card {
    // (T) Play: If the tide is high, destroy each artifact. Otherwise, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isTideHigh(),
                trueGameAction: ability.actions.destroy((context) => ({
                    target: context.game.cardsInPlay.filter((card) => card.type === 'artifact')
                })),
                falseGameAction: ability.actions.raiseTide()
            })
        });
    }
}

WashedAway.id = 'washed-away';

module.exports = WashedAway;
