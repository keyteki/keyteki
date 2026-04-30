const Card = require('../../Card.js');

class ConradFisique extends Card {
    // Enhance.
    // Play: You may move each +1 power counter from a creature to another
    // creature.
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            target: {
                activePromptTitle: 'Choose a creature to move power counters from',
                cardType: 'creature',
                cardCondition: (card) => card.hasToken('power'),
                gameAction: ability.actions.removePowerCounter((context) => ({
                    amount: context.target ? context.target.tokens.power || 0 : 0
                }))
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a creature to move power counters to',
                    cardType: 'creature',
                    cardCondition: (card, context) => card !== context.preThenEvent.card,
                    gameAction: ability.actions.addPowerCounter((context) => ({
                        amount: context.preThenEvent.amount
                    }))
                }
            }
        });
    }
}

ConradFisique.id = 'conrad-fisique';

module.exports = ConradFisique;
