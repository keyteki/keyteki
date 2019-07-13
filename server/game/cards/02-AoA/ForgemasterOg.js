const Card = require('../../Card.js');

class ForgemasterOg extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: () => true
            },
            gameAction: ability.actions.loseAmber(context => ({
                target: context.player,
                amount: context.player.amber
            }))
        });
    }
}

ForgemasterOg.id = 'forgemaster-og';

module.exports = ForgemasterOg;
