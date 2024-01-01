const Card = require('../../Card.js');

class ComOfficerPalik extends Card {
    // Versatile. (This card may be used as if it belonged to the active house.)
    //
    // After Fight/After Reap: A friendly creature captures 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canUse(
                (card, context, effectContext) => card === effectContext.source
            )
        });

        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

ComOfficerPalik.id = 'com-officer-palik';

module.exports = ComOfficerPalik;
