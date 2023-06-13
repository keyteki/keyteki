const Card = require('../../Card.js');

class SenatorQuintina extends Card {
    // After a creature reaps, exalt it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event) => event.card.type === 'creature'
            },
            gameAction: ability.actions.exalt((context) => ({
                target: context.event.card
            }))
        });
    }
}

SenatorQuintina.id = 'senator-quintina';

module.exports = SenatorQuintina;
