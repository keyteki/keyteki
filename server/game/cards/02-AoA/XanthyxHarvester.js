const Card = require('../../Card.js');

class XanthyxHarvester extends Card {
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
