const Card = require('../../Card.js');

class ForgemasterOg extends Card {
    // After a player forges a key, they lose all of their remaining A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: () => true
            },
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.event.player,
                amount: context.event.player.amber
            }))
        });
    }
}

ForgemasterOg.id = 'forgemaster-og';

module.exports = ForgemasterOg;
