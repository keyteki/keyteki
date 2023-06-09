const Card = require('../../Card.js');

class JohnnyLongfingers extends Card {
    // Each friendly Mutant creature gains, Destroyed: Steal 1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature' && card.hasTrait('mutant'),
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.steal()
            })
        });
    }
}

JohnnyLongfingers.id = 'johnny-longfingers';

module.exports = JohnnyLongfingers;
