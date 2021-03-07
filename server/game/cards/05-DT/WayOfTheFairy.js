const Card = require('../../Card.js');

class WayOfTheFairy extends Card {
    //This creature gains, "Reap: Gain 1A."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.gainAmber({ amount: 1 })
            })
        });
    }
}

WayOfTheFairy.id = 'way-of-the-fairy';

module.exports = WayOfTheFairy;
