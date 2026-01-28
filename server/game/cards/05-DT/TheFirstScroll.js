const Card = require('../../Card.js');

class TheFirstScroll extends Card {
    // After a player forges a key, each creature they control captures 1A from its own side.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: () => true
            },
            preferActionPromptMessage: true,
            gameAction: ability.actions.capture((context) => ({
                target: context.event.player.creaturesInPlay,
                player: context.event.player
            })),
            then: {
                message: '{0} uses {1} to make {3} capture 1 amber from their side',
                messageArgs: (context) => [context.preThenEvents.map((e) => e.card)]
            }
        });
    }
}

TheFirstScroll.id = 'the-first-scroll';

module.exports = TheFirstScroll;
