import Card from '../../Card.js';

class Holdfast extends Card {
    // After 1 of Holdfast's neighbors is dealt damage, ready Holdfast.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageApplied: (event, context) =>
                    event.clone.clonedNeighbors.includes(context.source)
            },
            gameAction: ability.actions.ready()
        });
    }
}

Holdfast.id = 'holdfast';

export default Holdfast;
