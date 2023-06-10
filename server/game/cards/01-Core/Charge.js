const Card = require('../../Card.js');

class Charge extends Card {
    // Play: For the remainder of the turn, each creature you play gains, Play: Deal 2<D> to an enemy creature.
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
