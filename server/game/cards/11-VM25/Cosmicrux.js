import Card from '../../Card.js';

class Cosmicrux extends Card {
    // After a player readies a creature, deal 1 to it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardReadied: (event) => event.card.type === 'creature' && event.exhausted
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.event.card
            }))
        });
    }
}

Cosmicrux.id = 'cosmicrux';

export default Cosmicrux;
