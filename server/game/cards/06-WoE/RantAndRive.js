const Card = require('../../Card.js');

class RantAndRive extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 8,
            gameAction: ability.actions.loseAmber((context) => ({
                amount: Math.floor(context.player.opponent.amber / 2)
            }))
        });
    }
}

RantAndRive.id = 'rant-and-rive';

module.exports = RantAndRive;
