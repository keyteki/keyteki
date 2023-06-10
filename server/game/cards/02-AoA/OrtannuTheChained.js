const Card = require('../../Card.js');

class OrtannuTheChained extends Card {
    // Reap: Return each copy of Ortannus Binding from your discard pile to your hand. For each one returned this way, deal 2D to a creature, with 2D splash.
    setupCardAbilities(ability) {
        this.reap({
            effect:
                'return each copy of Ortannu’s Binding to hand and deal 2 damage for each copy returned',
            gameAction: ability.actions.returnToHand((context) => ({
                location: 'discard',
                target: context.player.discard.filter((card) => card.name === 'Ortannu’s Binding')
            })),
            then: (context) => ({
                gameAction: ability.actions.allocateDamage({
                    numSteps: context.player.discard.filter(
                        (card) => card.name === 'Ortannu’s Binding'
                    ).length,
                    damageStep: 2,
                    splash: 2
                })
            })
        });
    }
}

OrtannuTheChained.id = 'ortannu-the-chained';

module.exports = OrtannuTheChained;
