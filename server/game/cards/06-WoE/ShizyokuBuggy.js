const Card = require('../../Card.js');

class ShizyokuBuggy extends Card {
    // Action: Reveal two cards from your hand. If they share a house,
    // discard them and make a token creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                activePromptTitle: 'Choose which cards to reveal and discard',
                mode: 'exactly',
                numCards: 2,
                controller: 'self',
                location: 'hand',
                gameAction: [
                    ability.actions.discard(),
                    ability.actions.makeTokenCreature((context) => ({
                        target: context.player
                    }))
                ]
            },
            effect: 'reveal and discard {0} to make a token creature',
            effectArgs: (context) => context.target.length
        });
    }
}

ShizyokuBuggy.id = 'shĭzyokŭ-buggy';

module.exports = ShizyokuBuggy;
