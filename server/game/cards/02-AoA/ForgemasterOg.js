const Card = require('../../Card.js');

class ForgemasterOg extends Card {
    setupCardAbilities(ability) {

        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player,
                amount: context.player.amber
            }))
        });
        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player === context.player.opponent
            },
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player.opponent,
                amount: context.player.opponent.amber
            }))
        });
    }
}

ForgemasterOg.id = 'forgemaster-og';

module.exports = ForgemasterOg;
