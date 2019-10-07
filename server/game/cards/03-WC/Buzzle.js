const Card = require('../../Card.js');

class Buzzle extends Card {
    setupCardAbilities(ability) {
        this.play({
            may: 'purge one of Buzzle\'s neighbors',
            fight: true,
            target: {
                cardType: 'creature',
                location: 'play area',
                controller: 'self',
                cardCondition: card => this.neighbors.includes(card),
                gameAction: ability.actions.purge({ location: 'play area' })
            },
            then: context => ({
                condition: context.target.location === 'purged',
                gameAction: ability.actions.ready({ target: this })
            })
        });
    }
}

Buzzle.id = 'buzzle';

module.exports = Buzzle;
