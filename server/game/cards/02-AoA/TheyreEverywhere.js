const Card = require('../../Card.js');

class TheyreEverywhere extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                'deal 2 damage to enemy flank creatures, and 1 damage to enemy creatutes not on a flank',
            gameAction: [
                ability.actions.dealDamage((context) => ({
                    amount: 2,
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.controller === context.player.opponent && card.isOnFlank()
                    )
                })),
                ability.actions.dealDamage((context) => ({
                    amount: 1,
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.controller === context.player.opponent && !card.isOnFlank()
                    )
                }))
            ]
        });
    }
}

TheyreEverywhere.id = 'they-re-everywhere';

module.exports = TheyreEverywhere;
