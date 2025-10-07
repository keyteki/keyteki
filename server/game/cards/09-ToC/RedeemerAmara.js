import Card from '../../Card.js';

class RedeemerAmara extends Card {
    // Each time an enemy creature or a Mutant creature is destroyed,
    // make a token creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.type === 'creature' &&
                    (event.clone.hasTrait('mutant') ||
                        event.card.controller !== context.source.controller)
            },
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

RedeemerAmara.id = 'redeemer-amara';

export default RedeemerAmara;
