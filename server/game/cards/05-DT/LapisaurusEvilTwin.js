const Card = require('../../Card.js');

class LapisaurusEvilTwin extends Card {
    // Skirmish.
    // Fight: Exalt the creature Lapisaurus fights.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.exalt((context) => ({
                target: context.event.card
            }))
        });
    }
}

LapisaurusEvilTwin.id = 'lapisaurus-evil-twin';

module.exports = LapisaurusEvilTwin;
