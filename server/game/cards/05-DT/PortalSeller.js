const Card = require('../../Card.js');

class PortalSeller extends Card {
    //While the tide is high, your opponent's keys cost +4A.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.modifyKeyCost(() => 4)
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Polish and is subject to change."
          ]
        }*/
    }
}

PortalSeller.id = 'portal-seller-';

module.exports = PortalSeller;
