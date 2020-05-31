const Card = require('../../Card.js');

class Squawker extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: [
                    ability.actions.ready((context) => ({
                        target: context.target.hasHouse('mars') ? context.target : []
                    })),
                    ability.actions.stun((context) => ({
                        target: !context.target.hasHouse('mars') ? context.target : []
                    }))
                ]
            }
        });
    }
}

Squawker.id = 'squawker';

module.exports = Squawker;
