const Card = require('../../Card.js');

class CXOTaber extends Card {
    // Fight/Reap: You may play or use a non-Star Alliance card this turn.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'allow them to play or use one non staralliance card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayOrUseNonHouse('staralliance')
            })
        });
    }
}

CXOTaber.id = 'cxo-taber';

module.exports = CXOTaber;
