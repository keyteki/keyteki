const Card = require('../../Card.js');

class SampleCollection extends Card {
    // Play: Put an enemy creature into your archives for each key your opponent has forged. If any of these creatures leave your archives, they are put into their owners hand instead.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.getForgedKeys() > 0,
            effect: 'abduct {1} creatures',
            effectArgs: (context) =>
                context.player.opponent.keys &&
                Math.max(
                    0,
                    Object.values(context.player.opponent.keys).filter((key) => key).length
                ),
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.player.opponent.getForgedKeys(),
                action: ability.actions.archive({
                    owner: false,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to archive',
                        cardType: 'creature',
                        controller: 'opponent'
                    }
                })
            }))
        });
    }
}

SampleCollection.id = 'sample-collection';

module.exports = SampleCollection;
