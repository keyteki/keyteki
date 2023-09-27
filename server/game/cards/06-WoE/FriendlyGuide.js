const Card = require('../../Card.js');

class FriendlyGuide extends Card {
    //Elusive
    //After you use one of Friendly Guide's neighbors, you may use Friendly Guide.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    context.game.activePlayer === context.source.controller &&
                    !!event.clone &&
                    event.clone.neighbors.includes(context.source)
            },
            optional: true,
            gameAction: ability.actions.use()
        });
    }
}

FriendlyGuide.id = 'friendly-guide';

module.exports = FriendlyGuide;
