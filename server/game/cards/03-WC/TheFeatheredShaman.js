const Card = require('../../Card.js');

class TheFeatheredShaman extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.ward(context => ({
                target: context.source.neighbors
            })),
            effect: 'ward neighbors'
        });
    }
}

TheFeatheredShaman.id = 'the-feathered-shaman'; // This is a guess at what the id might be - please check it!!!

module.exports = TheFeatheredShaman;
