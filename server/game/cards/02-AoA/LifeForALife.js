const Card = require('../../Card.js');

class LifeForALife extends Card {
    // Play: Destroy a friendly creature. If you do, deal 6D to a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to destroy',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                message: '{0} uses {1} to deal 6 damage to {2}',
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 6 })
                }
            }
        });
    }
}

LifeForALife.id = 'life-for-a-life';

module.exports = LifeForALife;
