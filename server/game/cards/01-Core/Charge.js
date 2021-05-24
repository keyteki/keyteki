const Card = require('../../Card.js');

class Charge extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn({
                match: (card) => card.type === 'creature',
                effect: ability.effects.gainAbility('play', {
                    target: {
                        cardType: 'creature',
                        controller: 'opponent',
                        gameAction: ability.actions.dealDamage({ amount: 2 })
                    }
                })
            })
        });
    }
}

Charge.id = 'charge';

module.exports = Charge;
