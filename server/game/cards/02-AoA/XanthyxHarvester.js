const Card = require('../../Card.js');

class XanthyxHarvester extends Card {
    // Xanthyx Harvester cannot be used while it has a non-Mars neighbor.
    // Reap: Gain 1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.neighbors.filter((card) => !card.hasHouse('mars')).length > 0,
            effect: ability.effects.cardCannot('use')
        });
        this.reap({
            gameAction: ability.actions.gainAmber()
        });
    }
}

XanthyxHarvester.id = 'xanthyx-harvester';

module.exports = XanthyxHarvester;
