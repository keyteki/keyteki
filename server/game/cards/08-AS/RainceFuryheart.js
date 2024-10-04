const Card = require('../../Card.js');

class RainceFuryheart extends Card {
    // Before Fight: Exalt the creature Raince Furyheart fights.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.exalt((context) => ({
                target: context.event.card
            }))
        });
    }
}

RainceFuryheart.id = 'raince-furyheart';

module.exports = RainceFuryheart;
