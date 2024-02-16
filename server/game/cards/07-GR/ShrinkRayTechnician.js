const Card = require('../../Card.js');

class ShrinkRayTechnician extends Card {
    // After Reap: Choose an enemy creature. It gets -2 power until
    // the end of the turn.
    //
    // Scrap: Choose the most powerful enemy creature. Until the end of the
    // turn, that creature is considered to have 1 power and 0 armor.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.modifyPower(-2)
                })
            },
            effect: 'make {0} have -2 power for the remainder of the turn'
        });

        this.scrap({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                mode: 'mostStat',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.cardLastingEffect({
                    effect: [ability.effects.setPower(1), ability.effects.setArmor(0)]
                })
            },
            effect: 'make {0} have 1 power and 0 armor for the remainder of the turn'
        });
    }
}

ShrinkRayTechnician.id = 'shrink-ray-technician';

module.exports = ShrinkRayTechnician;
