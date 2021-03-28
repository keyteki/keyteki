const Card = require('../../Card.js');

class JohnnyLongfingers extends Card {
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
