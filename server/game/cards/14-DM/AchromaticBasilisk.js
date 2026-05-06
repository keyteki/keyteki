const Card = require('../../Card.js');

class AchromaticBasilisk extends Card {
    // Skirmish.
    // After Fight: Exhaust an enemy creature.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

AchromaticBasilisk.id = 'achromatic-basilisk';

module.exports = AchromaticBasilisk;
