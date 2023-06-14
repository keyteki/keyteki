const Card = require('../../Card.js');

class Truebaru extends Card {
    // You must lose 3<A> in order to play Truebaru.
    // Taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    // Destroyed: Gain 5<A>.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            location: 'any',
            effect: ability.effects.additionalCost(
                (context) =>
                    context.source === this &&
                    context.ability.isCardPlayed() &&
                    ability.costs.loseAmber(3)
            )
        });

        this.destroyed({
            gameAction: ability.actions.gainAmber({ amount: 5 })
        });
    }
}

Truebaru.id = 'truebaru';

module.exports = Truebaru;
