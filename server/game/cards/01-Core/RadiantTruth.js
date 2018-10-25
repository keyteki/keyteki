const Card = require('../../Card.js');

class RadiantTruth extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.stun(context => ({
                target: context.player.opponent.creaturesInPlay.filter(card => !card.isOnFlank())
            }))
        });
    }
}

RadiantTruth.id = 'radiant-truth'; // This is a guess at what the id might be - please check it!!!

module.exports = RadiantTruth;
