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

HallowedShield.id = 'hallowed-shield'; // This is a guess at what the id might be - please check it!!!

module.exports = HallowedShield;
