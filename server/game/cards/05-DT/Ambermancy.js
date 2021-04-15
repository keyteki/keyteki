const Card = require('../../Card.js');

class Ambermancy extends Card {
    // Play: Remove up to three +1 power counters from a creature. Gain 1A for each counter removed this way.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.removePowerCounter({ amount: 3, upTo: true })
            },
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount
                }))
            }
        });
    }
}

Ambermancy.id = 'æmbermancy';

module.exports = Ambermancy;
