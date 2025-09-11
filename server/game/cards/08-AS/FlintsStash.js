const Card = require('../../Card.js');

class FlintsStash extends Card {
    // Each flank creature gains, “Destroyed: Gain 2A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.isOnFlank(),
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.gainAmber({ amount: 2 })
            })
        });
    }
}

FlintsStash.id = 'flint-s-stash';

module.exports = FlintsStash;
