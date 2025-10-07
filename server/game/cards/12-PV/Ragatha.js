import Card from '../../Card.js';

class Ragatha extends Card {
    // Treachery.
    // After an enemy creature reaps, deal 3D to each of Ragatha’s neighbors.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller !== context.source.controller
            },
            gameAction: ability.actions.dealDamage(() => ({
                amount: 3,
                target: this.neighbors
            }))
        });
    }
}

Ragatha.id = 'ragatha';

export default Ragatha;
