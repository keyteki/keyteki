const Card = require('../../Card.js');

class NomadicInsight extends Card {
    // Play: Each friendly flank creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            effect: 'cause each friendly flank creature to capture 1 amber',
            gameAction: ability.actions.capture((context) => ({
                amount: 1,
                target: context.player.creaturesInPlay.filter(
                    (card) => card.controller == context.player && card.isOnFlank()
                )
            }))
        });
    }
}

NomadicInsight.id = 'nomadic-insight';

module.exports = NomadicInsight;
