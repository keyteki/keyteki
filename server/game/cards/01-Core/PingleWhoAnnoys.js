const Card = require('../../Card.js');

class PingleWhoAnnoys extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Deal 1<D> to each enemy creature after it enters play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.type === 'creature' && event.context.player !== context.player
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.event.card
            }))
        });
    }
}

PingleWhoAnnoys.id = 'pingle-who-annoys';

module.exports = PingleWhoAnnoys;
