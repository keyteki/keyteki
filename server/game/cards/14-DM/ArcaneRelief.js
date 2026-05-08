const Card = require('../../Card.js');

class ArcaneRelief extends Card {
    // Play: Choose a friendly exhausted creature. Ready and use that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'ready and use {0}'
        });
    }
}

ArcaneRelief.id = 'arcane-relief';

module.exports = ArcaneRelief;
