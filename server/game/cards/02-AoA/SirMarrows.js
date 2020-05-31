const Card = require('../../Card.js');

class SirMarrows extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event) =>
                    event.card.controller !== this.controller && event.card.type === 'creature'
            },
            gameAction: ability.actions.sequential([
                ability.actions.placeAmber({
                    amount: 1,
                    target: this
                }),
                ability.actions.loseAmber((context) => ({
                    target: context.player.opponent,
                    amount: 1
                }))
            ]),
            effect: 'capture 1 amber'
        });
    }
}

SirMarrows.id = 'sir-marrows';

module.exports = SirMarrows;
