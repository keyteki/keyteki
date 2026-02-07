const Card = require('../../Card.js');

class MarsNeedsAmber extends Card {
    // Play: Each damaged enemy non-Mars creature captures 1A from their own side.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'make each damaged enemy non-mars creature capture 1 amber from their side',
            gameAction: ability.actions.capture((context) => ({
                target: context.player.opponent.creaturesInPlay.filter(
                    (card) => card.hasToken('damage') && !card.hasHouse('mars')
                ),
                player: context.player.opponent
            }))
        });
    }
}

MarsNeedsAmber.id = 'mars-needs-æmber';

module.exports = MarsNeedsAmber;
