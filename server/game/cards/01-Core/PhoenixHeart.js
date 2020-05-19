const Card = require('../../Card.js');

class PhoenixHeart extends Card {
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
