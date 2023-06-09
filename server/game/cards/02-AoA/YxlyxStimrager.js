const Card = require('../../Card.js');

class YxlyxStimrager extends Card {
    // Fight: Deal 2D to a creature and move it to either flank of its controllers battleline.
    setupCardAbilities(ability) {
        this.fight({
            effect: 'deal 2 damage to {1} and move it to a flank',
            effectArgs: (context) => context.target,
            target: {
                cardType: 'creature',
                gameAction: [
                    ability.actions.dealDamage({
                        amount: 2
                    }),
                    ability.actions.moveToFlank()
                ]
            }
        });
    }
}

YxlyxStimrager.id = 'yxlyx-stimrager';

module.exports = YxlyxStimrager;
