const _ = require('underscore');
const Card = require('../../Card.js');

class Keyforgery extends Card {
    // When your opponent would forge a key, that player names a house. Reveal a random card from your hand. If that card is not of the named house, destroy Keyforgery and they do not forge that key (no A is spent).
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onForgeKey: (event, context) =>
                    context.player.opponent === context.game.activePlayer
            },
            target: {
                mode: 'house'
            },
            effect: 'make {1} name house {2}',
            effectArgs: (context) => [context.player.opponent, context.house],
            gameAction: ability.actions.reveal((context) => ({
                location: 'hand',
                chatMessage: true,
                target: _.shuffle(context.player.hand)[0]
            })),
            then: (preThenContext) => ({
                condition: (context) => !context.preThenEvent.card.hasHouse(preThenContext.house),
                message: "{0} uses {1} to destroy itself and skip opponent's Forge Key step",
                gameAction: [
                    ability.actions.destroy((context) => ({
                        target: context.source
                    })),
                    ability.actions.changeEvent({
                        event: preThenContext.event,
                        cancel: true
                    })
                ]
            })
        });
    }
}

Keyforgery.id = 'keyforgery';

module.exports = Keyforgery;
