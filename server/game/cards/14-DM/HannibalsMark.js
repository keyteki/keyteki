const Card = require('../../Card.js');

class HannibalsMark extends Card {
    // Play: Take control of an enemy flank creature and give it three +1
    // power counters. While under your control, it belongs to house
    // Skyborn. (Instead of its original house.)
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: [
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: [
                            ability.effects.takeControl(context.player),
                            ability.effects.changeHouse('skyborn')
                        ]
                    })),
                    ability.actions.addPowerCounter({ amount: 3 })
                ]
            }
        });
    }
}

HannibalsMark.id = 'hannibal-s-mark';

module.exports = HannibalsMark;
