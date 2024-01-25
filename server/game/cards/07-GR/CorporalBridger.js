const Card = require('../../Card.js');

class CorporalBridger extends Card {
    // Play/After Fight/After Reap: You may use a non-Star Alliance
    // creature this turn.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            effect: 'allow them to play or use one non staralliance card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canUseNonHouse('staralliance')
            })
        });
    }
}

CorporalBridger.id = 'corporal-bridger';

module.exports = CorporalBridger;
