const Card = require('../../Card.js');

class SirMarrows extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event) =>
                    event.card.controller !== this.controller && event.card.type === 'creature'
            },
            gameAction: ability.actions.capture()
        });
    }
}

SirMarrows.id = 'sir-marrows';

module.exports = SirMarrows;
