import Card from '../../Card.js';

class Falcron extends Card {
    // Each of Falcron’s neighbors gains, “After Reap: Steal 1A.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.steal()
            })
        });
    }
}

Falcron.id = 'falcron';

export default Falcron;
