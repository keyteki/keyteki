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
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a card to archive',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.archive()
                },
                then: {
                    alwaysTriggers: true,
                    condition: (context) => context.player.isOverwhelmed(),
                    target: {
                        cardType: 'creature',
                        gameAction: ability.actions.returnToHand()
                    },
                    then: {
                        alwaysTriggers: true,
                        target: {
                            activePromptTitle: 'Choose a card to archive',
                            location: 'hand',
                            controller: 'self',
                            gameAction: ability.actions.archive()
                        }
                    }
                }
            }
        });
    }
}

NowAndLater.id = 'now-and-later';

module.exports = NowAndLater;
