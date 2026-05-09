const Card = require('../../Card.js');

class HannibalsMark extends Card {
    // Play: Take control of an enemy flank creature and give it three +1 power counters. While under your control, it belongs to house Skyborn. (Instead of its original house.)
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: [
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player)
                    })),
                    ability.actions.addPowerCounter({ amount: 3 })
                ]
            },
            then: (context) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.cardLastingEffect({
                    target: context.target,
                    condition: () => context.target.controller === context.player,
                    until: {
                        onCardLeavesPlay: (event) => event.card === context.source
                    },
                    effect: ability.effects.changeHouse('skyborn')
                })
            }),
            effect: "take control of {0}, give it three +1 power counters, and make it Skyborn while it's under their control"
        });
    }
}

HannibalsMark.id = 'hannibal-s-mark';

module.exports = HannibalsMark;
