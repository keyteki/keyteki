const Card = require('../../Card.js');

class DarkFaerie extends Card {
    setupCardAbilities(ability) {
        this.fight({
            effect: 'gain 2 amber',
            gameAction: ability.actions.gainAmber((context) => ({
                amount: 2,
                target: context.player
            }))
        });
    }
}

DarkFaerie.id = 'dark-faerie';

module.exports = DarkFaerie;
