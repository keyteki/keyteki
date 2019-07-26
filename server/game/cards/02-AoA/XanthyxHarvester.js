const Card = require('../../Card.js');

class XanthyxHarvester extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition:  () => (this.neighbors.length > 0 && this.neighbors.filter(card => !card.hasHouse('mars')).length > 0),
            match: this,
            effect: ability.effects.cardCannot('use')
        });
        this.reap({
            gameAction: ability.actions.gainAmber()
        });
    }
}

XanthyxHarvester.id = 'xanthyx-harvester';

module.exports = XanthyxHarvester;
