import Card from '../../Card.js';

class Slipshot extends Card {
    // After a neighbor of Slipshot is destroyed, ready Slipshot.
    // Play: Make a token creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.type === 'creature' &&
                    event.clone.clonedNeighbors.includes(context.source)
            },
            gameAction: ability.actions.ready()
        });

        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

Slipshot.id = 'slipshot';

export default Slipshot;
