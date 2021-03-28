const Card = require('../../Card.js');

class Valoocanth extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.exhaust((context) => ({
                    target: context.target ? context.target.neighbors.concat(context.target) : []
                }))
            }
        });
    }
}

Valoocanth.id = 'valoocanth';

module.exports = Valoocanth;
