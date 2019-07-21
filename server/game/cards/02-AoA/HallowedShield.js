const Card = require('../../Card.js');

class HallowedShield extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.forRemainderOfTurn({
                    effect: ability.effects.cardCannot('damage')
                })
            }
        });
    }
}

HallowedShield.id = 'hallowed-shield';

module.exports = HallowedShield;
