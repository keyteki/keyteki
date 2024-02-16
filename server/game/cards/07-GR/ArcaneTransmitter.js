const Card = require('../../Card.js');

class ArcaneTransmitter extends Card {
    // Action: Discard the top 4 cards of any player's deck.
    //
    // Scrap: Shuffle your discard pile into your deck.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'select',
                activePromptTitle: "Which player's deck",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            effect: 'discard the top 4 cards of a deck',
            gameAction: ability.actions.conditional((context) => ({
                condition:
                    !context.select || context.select === 'Mine'
                        ? context.player.deck.length > 0
                        : context.player.opponent.deck.length > 0,
                trueGameAction: ability.actions.discard({
                    target:
                        !context.select || context.select === 'Mine'
                            ? context.player.deck.slice(0, Math.min(4, context.player.deck.length))
                            : context.player.opponent.deck.slice(
                                  0,
                                  Math.min(4, context.player.opponent.deck.length)
                              )
                })
            }))
        });

        this.scrap({
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: context.player.discard
            }))
        });
    }
}

ArcaneTransmitter.id = 'arcane-transmitter';

module.exports = ArcaneTransmitter;
