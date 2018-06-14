const ProvinceCard = require('../../provincecard.js');

class FeastOrFamine extends ProvinceCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Move fate from an opposing character',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                cardType: 'character',
                controller: 'opponent',
                gameAction: ability.actions.placeFate(context => ({
                    origin: context.target,
                    amount: context.target.fate,
                    promptForSelect: {
                        cardType: 'character',
                        controller: 'self',
                        cardCondition: card => card.fate === 0,
                        message: '{0} moves the fate to {2}'
                    }
                }))
            },
            effect: 'move all fate from {0} to a character they control'
        });
    }
}

FeastOrFamine.id = 'feast-or-famine';

module.exports = FeastOrFamine;
