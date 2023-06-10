const Card = require('../../Card.js');

class Maleficorn extends Card {
    // Enhance DDDD.
    // After an enemy creature is dealt damage by a D bonus icon, deal 1D to that creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageApplied: (event, context) =>
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
