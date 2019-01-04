const Card = require('../../Card.js');

class PingleWhoAnnoys extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card.type === 'creature' && event.context.player !== context.player
            },
            gameAction: ability.actions.dealDamage(context => ({
                amount: 1,
                target: context.event.card
            }))
        });
    }
}

PingleWhoAnnoys.id = 'pingle-who-annoys'; // This is a guess at what the id might be - please check it!!!

module.exports = PingleWhoAnnoys;
