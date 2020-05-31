const Card = require('../../Card.js');

class RadiantTruth extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.stun((context) => ({
                target: context.player.opponent.creaturesInPlay.filter((card) => !card.isOnFlank())
            }))
        });
    }
}

RadiantTruth.id = 'radiant-truth';

module.exports = RadiantTruth;
