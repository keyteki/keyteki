const Card = require('../../Card.js');

class DrMilli extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.opponent.creaturesInPlay.length >
                    context.player.creaturesInPlay.length - 1,
            target: {
                mode: 'exactly',
                controller: 'self',
                location: 'hand',
                numCards: (context) =>
                    Math.min(
                        context.player.hand.length,
                        context.player.opponent.creaturesInPlay.length -
                            (context.player.creaturesInPlay.length - 1)
                    ),
                gameAction: ability.actions.archive()
            }
        });
    }
}

DrMilli.id = 'dr-milli';

module.exports = DrMilli;
