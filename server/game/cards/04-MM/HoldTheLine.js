const Card = require('../../Card.js');

class HoldTheLine extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.opponent.creaturesInPlay.length >
                    context.player.creaturesInPlay.length,
            gameAction: ability.actions.draw((context) => ({
                amount:
                    context.player.opponent.creaturesInPlay.length -
                    context.player.creaturesInPlay.length
            }))
        });
    }
}

HoldTheLine.id = 'hold-the-line';

module.exports = HoldTheLine;
