const Card = require('../../Card.js');

class PriestessLeilani extends Card {
    // After Reap: Exhaust an enemy creature. If you do, ready a non-Priest creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
            },
            then: {
                target: {
                    cardType: 'creature',
                    cardCondition: (card) => !card.hasTrait('priest'),
                    gameAction: ability.actions.ready()
                }
            }
        });
    }
}

PriestessLeilani.id = 'priestess-leilani';

module.exports = PriestessLeilani;
