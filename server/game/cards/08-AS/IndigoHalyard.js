import Card from '../../Card.js';

class IndigoHalyard extends Card {
    // While your blue key is forged, Indigo Halyard gains, “After
    // Reap: Ready and fight with another friendly creature.”
    // While your opponent’s blue key is forged, each of Indigo
    // Halyard’s neighbors gains taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source && card.controller.keys.blue,
            effect: ability.effects.gainAbility('reap', {
                effect: 'ready and fight with {1}',
                effectArgs: (context) => [context.target],
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card, context) => context.source !== card,
                    gameAction: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.fight()
                    ])
                }
            })
        });

        this.persistentEffect({
            match: (card, context) =>
                context.source.neighbors.includes(card) &&
                card.controller.opponent &&
                card.controller.opponent.keys.blue,
            effect: ability.effects.addKeyword({ taunt: 1 })
        });
    }
}

IndigoHalyard.id = 'indigo-halyard';

export default IndigoHalyard;
