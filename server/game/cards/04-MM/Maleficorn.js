const Card = require('../../Card.js');

class Maleficorn extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    !!event.bonus && event.card.controller !== context.player
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.event.card,
                amount: 1
            }))
        });
    }
}

Maleficorn.id = 'maleficorn';

module.exports = Maleficorn;
