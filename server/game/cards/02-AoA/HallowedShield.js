const Card = require('../../Card.js');

class HallowedShield extends Card {
    // Action: Choose a creature. For the remainder of the turn, the chosen creature cannot be dealt damage.
    setupCardAbilities(ability) {
        this.action({
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.cardCannot('damage')
                })
            }
        });
    }
}

HallowedShield.id = 'hallowed-shield';

module.exports = HallowedShield;
