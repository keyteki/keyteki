const Card = require('../../Card.js');

class GreyWarden extends Card {
    // Deploy.
    // After Fight/After Reap: Ready a neighboring Sanctum creature.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                cardCondition: (card, context) =>
                    card.hasHouse('sanctum') && card.neighbors.includes(context.source),
                gameAction: ability.actions.ready()
            }
        });
    }
}

GreyWarden.id = 'grey-warden';

module.exports = GreyWarden;
