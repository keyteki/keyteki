import Card from '../../Card.js';

class OrbOfInvidius extends Card {
    // After a creature reaps, stun it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event) => event.card.type === 'creature'
            },
            gameAction: ability.actions.stun((context) => ({
                target: context.event.card
            }))
        });
    }
}

OrbOfInvidius.id = 'orb-of-invidius';

export default OrbOfInvidius;
