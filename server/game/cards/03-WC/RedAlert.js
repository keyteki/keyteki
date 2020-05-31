const Card = require('../../Card.js');

class RedAlert extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.opponent.creaturesInPlay.length >
                    context.player.creaturesInPlay.length,
            gameAction: ability.actions.dealDamage((context) => ({
                amount:
                    context.player.opponent.creaturesInPlay.length -
                    context.player.creaturesInPlay.length,
                target: context.player.opponent.creaturesInPlay
            }))
        });
    }
}

RedAlert.id = 'red-alert';

module.exports = RedAlert;
