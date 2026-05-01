const Card = require('../../Card.js');

class NowAndLater extends Card {
    // Play: Return a creature to its owner's hand and archive a card. If you
    // are overwhelmed, repeat the preceding effect.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.returnToHand()
            },
            message: "{0} uses {1} to return {2} to its owner's hand",
            messageArgs: (context) => [context.player, context.source, context.target || 'nothing'],
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a card to archive',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.archive()
                },
                message: '{0} uses {1} to archive a card',
                then: {
                    alwaysTriggers: true,
                    condition: (context) => context.player.isOverwhelmed(),
                    target: {
                        cardType: 'creature',
                        gameAction: ability.actions.returnToHand()
                    },
                    message: "{0} uses {1} to return {2} to its owner's hand",
                    messageArgs: (context) => [context.target || 'nothing'],
                    then: {
                        alwaysTriggers: true,
                        target: {
                            activePromptTitle: 'Choose a card to archive',
                            location: 'hand',
                            controller: 'self',
                            gameAction: ability.actions.archive()
                        },
                        message: '{0} uses {1} to archive a card'
                    }
                }
            }
        });
    }
}

NowAndLater.id = 'now-and-later';

module.exports = NowAndLater;
