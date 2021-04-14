const Card = require('../../Card.js');

class TheFirstScroll extends Card {
    // After a player forges a key, each creature they control captures 1A from its own side.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: () => true
            },
            effect: 'make each friendly creature capture 1 amber from their side',
            gameAction: ability.actions.capture((context) => ({
                target: context.game.activePlayer.creaturesInPlay,
                player: context.game.activePlayer
            }))
        });
    }
}

TheFirstScroll.id = 'the-first-scroll';

module.exports = TheFirstScroll;
