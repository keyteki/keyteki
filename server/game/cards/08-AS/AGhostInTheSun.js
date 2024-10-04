const Card = require('../../Card.js');

class AGhostInTheSun extends Card {
    // Play: For each forged key your opponent has, put a creature into play
    // from your discard pile.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'put a creature into play from their discard for each key {1} has forged',
            effectArgs: (context) => [context.player.opponent],
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.player.opponent ? context.player.opponent.getForgedKeys() : 0,
                action: ability.actions.putIntoPlay({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to put into play',
                        cardType: 'creature',
                        controller: 'self',
                        location: 'discard',
                        message: '{0} uses {1} to put {2} into play',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    },
                    myControl: true
                })
            }))
        });
    }
}

AGhostInTheSun.id = 'a-ghost-in-the-sun';

module.exports = AGhostInTheSun;
