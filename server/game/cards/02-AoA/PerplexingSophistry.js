const Card = require('../../Card.js');

class PerplexingSophistry extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.amber > context.player.opponent.amber,
            gameAction: [
                ability.actions.draw((context) => ({ target: context.player })),
                ability.actions.discardAtRandom()
            ]
        });
    }
}

PerplexingSophistry.id = 'perplexing-sophistry';

module.exports = PerplexingSophistry;
