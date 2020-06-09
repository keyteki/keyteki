const Card = require('../../Card.js');

class MercyMalkinQueen extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    context.player === event.player &&
                    event.card.type === 'creature' &&
                    event.card.hasTrait('cat')
            },
            gameAction: ability.actions.ward((context) => ({ target: context.event.card }))
        });

        this.fight({
            effect: 'ready a friendly Beast creature.',
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('beast'),
                gameAction: ability.actions.ready()
            }
        });
    }
}

MercyMalkinQueen.id = 'mercy-malkin-queen';

module.exports = MercyMalkinQueen;
