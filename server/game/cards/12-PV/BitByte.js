const Card = require('../../Card.js');

class BitByte extends Card {
    // Skirmish.
    // After Fight: Put the creature Bit Byte fights into its owner's archives.
    // Fate: Your opponent archives the bottom card of their deck.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.archive((context) => ({
                target: context.event.card.location === 'play area' ? context.event.card : []
            }))
        });

        this.fate({
            gameAction: ability.actions.archive((context) => ({
                target:
                    context.game.activePlayer.opponent.deck.length > 0
                        ? context.game.activePlayer.opponent.deck[
                              context.game.activePlayer.opponent.deck.length - 1
                          ]
                        : null
            })),
            effect: "archive the bottom card of {1}'s deck",
            effectArgs: (context) => context.game.activePlayer.opponent
        });
    }
}

BitByte.id = 'bit-byte';

module.exports = BitByte;
