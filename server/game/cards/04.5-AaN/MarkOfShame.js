const DrawCard = require('../../drawcard.js');

class MarkOfShame extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Dishonor attached character',
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.dishonor(context => ({ target: context.source.parent })),
            then: context => ({
                gameAction: ability.actions.dishonor({ target: context.source.parent })
            })
        });
    }
}

MarkOfShame.id = 'mark-of-shame';

module.exports = MarkOfShame;
