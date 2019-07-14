const Card = require('../../Card.js');

class OrtannuTheChained extends Card {
    setupCardAbilities(ability) {
        this.reap({
            effect: 'return each copy of Ortannu’s Binding to hand and deal 2 damage for each copy returned',
            gameAction: ability.actions.returnToHand(context => ({
                location: 'discard',
                target: context.player.discard.filter(card => card.name === 'Ortannu’s Binding')
            })),
            then: context => {
                let amount = context.player.discard.filter(card => card.name === 'Ortannu’s Binding').length;

                return {
                    gameAction: ability.actions.sequentialForEach(() => ({
                        num: amount,
                        action: ability.actions.dealDamage({
                            amount: 2,
                            splash: 2,
                            promptForSelect: {
                                activePromptTitle: 'Choose a creature to deal 2 damage to',
                                cardType: 'creature'
                            }
                        })
                    }))
                };
            }
        });
    }
}

OrtannuTheChained.id = 'ortannu-the-chained';

module.exports = OrtannuTheChained;
