const Card = require('../../Card.js');

class CrimsonDax extends Card {
    // After Reap: You may reveal a non-Mars card from your hand. If you do, purge it and give a Mars creature three +1 power counters.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                mode: 'upTo',
                numCards: 1,
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.purge()
            },
            then: {
                target: {
                    cardCondition: (card) => card.hasHouse('mars'),
                    cardType: 'creature',
                    gameAction: ability.actions.addPowerCounter({ amount: 3 })
                },
                effect: 'give {0} three +1 power counters'
            }
        });
    }
}

CrimsonDax.id = 'crimson-dax';

module.exports = CrimsonDax;
