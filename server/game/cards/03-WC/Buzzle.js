const Card = require('../../Card.js');

class Buzzle extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Play/Fight: You may purge one of Buzzles neighbors. If you do, ready Buzzle.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                optional: true,
                cardType: 'creature',
                location: 'play area',
                controller: 'self',
                cardCondition: (card) => this.neighbors.includes(card),
                gameAction: ability.actions.purge({ location: 'play area' })
            },
            then: (context) => ({
                condition: () => context.target.location === 'purged',
                gameAction: ability.actions.ready({ target: context.source })
            })
        });
    }
}

Buzzle.id = 'buzzle';

module.exports = Buzzle;
