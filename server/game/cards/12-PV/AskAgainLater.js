const Card = require('../../Card.js');

class AskAgainLater extends Card {
    // Each time your opponent chooses their active house, they must name a house on your identity card. Reveal the top card of your deck. If the revealed card does not match the named house, fulfill Ask Again Later.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onChooseActiveHouse: () => true
            },
            target: {
                mode: 'house',
                houses: (context) => context.source.controller.houses
            },
            effect: 'make {1} name house {2}',
            effectArgs: (context) => [context.game.activePlayer, context.house],
            gameAction: ability.actions.reveal((context) => ({
                location: 'deck',
                chatMessage: true,
                target: context.player.deck[0]
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) =>
                    !context.preThenEvent ||
                    !context.preThenEvent.card.hasHouse(preThenContext.house),
                gameAction: ability.actions.fulfillProphecy((context) => ({
                    card: context.source
                }))
            })
        });
    }
}

AskAgainLater.id = 'ask-again-later';

module.exports = AskAgainLater;
