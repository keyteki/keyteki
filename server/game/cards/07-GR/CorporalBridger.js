const Card = require('../../Card.js');

class CorporalBridger extends Card {
    // Play/After Fight/After Reap: You may use a non-Star Alliance
    // creature this turn.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            effect: 'allow them to use one non staralliance creature this turn',
            gameAction: ability.actions.untilPlayerTurnEnd({
                effect: ability.effects.canUseNonHouseCreature('staralliance')
            })
        });
    }
}

CorporalBridger.id = 'corporal-bridger';

module.exports = CorporalBridger;
