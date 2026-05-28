const Card = require('../../Card.js');

class Cosmicrux extends Card {
    // After a player readies a creature, deal 1 to it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardsReadied: (event) => event.cards.some((card) => card.type === 'creature')
            },
            multiTriggerEvent: (event) => event.cards.filter((card) => card.type === 'creature'),
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.subject
            }))
        });
    }
}

Cosmicrux.id = 'cosmicrux';

module.exports = Cosmicrux;
