const Card = require('../../Card.js');

class Tsunami extends Card {
    // Play: Deal 4 damage to each ready creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 4,
                target: context.game.creaturesInPlay.filter((card) => !card.exhausted)
            }))
        });
    }
}

Tsunami.id = 'tsunami';

module.exports = Tsunami;
