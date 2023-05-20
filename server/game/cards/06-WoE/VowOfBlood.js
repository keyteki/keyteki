const Card = require('../../Card.js');

class VowOfBlood extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to each damaged enemy creature',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player && card.hasToken('damage')
                )
            }))
        });
    }
}

VowOfBlood.id = 'vow-of-blood';

module.exports = VowOfBlood;
