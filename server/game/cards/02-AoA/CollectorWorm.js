const Card = require('../../Card.js');

class CollectorWorm extends Card {
    // Fight: Archive the creature Collector Worm fights. If that creature leaves your archives, put it in its owners hand instead.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.archive((context) => ({
                owner: false,
                target: context.event.card.location === 'play area' ? context.event.card : []
            }))
        });
    }
}

CollectorWorm.id = 'collector-worm';

module.exports = CollectorWorm;
