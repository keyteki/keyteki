const Card = require('../../Card.js');

class PortalSeller extends Card {
    //While the tide is high, your opponent's keys cost +4A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.modifyKeyCost(() => 4)
        });
    }
}

PortalSeller.id = 'portal-seller';

module.exports = PortalSeller;
