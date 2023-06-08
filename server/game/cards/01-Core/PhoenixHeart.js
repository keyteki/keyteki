const Card = require('../../Card.js');

class PhoenixHeart extends Card {
    // This creature gains, Destroyed: Return this creature to its owners hand and deal 3D to each creature in play.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('destroyed', {
                effect: 'return {0} to hand and deal 3 damage to all creatures',
                gameAction: [
                    ability.actions.returnToHand(),
                    ability.actions.dealDamage((context) => ({
                        amount: 3,
                        target: context.game.creaturesInPlay
                    }))
                ]
            })
        });
    }
}

PhoenixHeart.id = 'phoenix-heart';

module.exports = PhoenixHeart;
