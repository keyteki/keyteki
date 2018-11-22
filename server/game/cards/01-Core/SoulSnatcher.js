const Card = require('../../Card.js');

class SoulSnatcher extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardDestroyed: event => event.card.type === 'creature'
            },
            gameAction: ability.actions.gainAmber(context => ({
                target: context.event.clone.controller
            }))
        });
    }
}

SoulSnatcher.id = 'soul-snatcher'; // This is a guess at what the id might be - please check it!!!

module.exports = SoulSnatcher;
