const Card = require('../../Card.js');

class LifeForALife extends Card {
    // Play: Sacrifice a creature to deal 6D to a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to sacrifice',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sacrifice()
            },
            then: {
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
