const Card = require('../../Card.js');

class AmberImp extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event) => event.card.type === 'creature'
            },
            gameAction: ability.actions.stun((context) => ({
                target: context.event.card
            }))
        });
    }
}

AmberImp.id = 'æmber-imp';

module.exports = AmberImp;
