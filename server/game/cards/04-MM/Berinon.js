const Card = require('../../Card.js');

class Berinon extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.type === 'creature' && event.card.hasTrait('mutant')
            },
            gameAction: ability.actions.enrage()
        });

        this.reap({
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

Berinon.id = 'berinon';

module.exports = Berinon;
