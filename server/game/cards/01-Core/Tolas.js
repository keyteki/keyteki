const Card = require('../../Card.js');

class Tolas extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardDestroyed: event => event.card.type === 'creature' && event.card.controller.opponent
            },
            gameAction: ability.actions.gainAmber(context => ({
                target: context.event.card.controller.opponent
            }))
        });
    }
}

Tolas.id = 'tolas'; // This is a guess at what the id might be - please check it!!!

module.exports = Tolas;
