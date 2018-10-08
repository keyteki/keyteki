const Card = require('../../Card.js');

class Autocannon extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: event => event.card.type === 'creature'
            },
            gameAction: ability.actions.dealDamage(context => ({
                amount: 1,
                target: context.event.card 
            }))
        });
    }
}

Autocannon.id = 'autocannon'; // This is a guess at what the id might be - please check it!!!

module.exports = Autocannon;
