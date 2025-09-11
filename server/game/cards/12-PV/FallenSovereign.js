const Card = require('../../Card.js');

class FallenSovereign extends Card {
    // Each of Fallen Sovereign's neighbors gains the Mutant trait.
    // Fate: Put Fallen Sovereign into play under your control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.addTrait('mutant')
        });

        this.fate({
            gameAction: ability.actions.putIntoPlay((context) => ({
                controller: context.game.activePlayer
            }))
        });
    }
}

FallenSovereign.id = 'fallen-sovereign';

module.exports = FallenSovereign;
