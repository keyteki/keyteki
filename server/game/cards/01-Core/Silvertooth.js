const Card = require('../../Card.js');

class Silvertooth extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.ready()
        });
    }
}

Silvertooth.id = 'silvertooth'; // This is a guess at what the id might be - please check it!!!

module.exports = Silvertooth;
