const Card = require('../../Card.js');
const _ = require('underscore');

class EddyOfDis extends Card {
    // Play: Shuffle a random card from your opponent's hand into their deck.
    // Fate: Your opponent shuffles their discard pile into their deck. They draw a card.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.hand.length > 0,
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: _.shuffle(
                    context.player.opponent ? context.player.opponent.hand : []
                ).slice(0, 1)
            }))
        });

        this.fate({
            effect: "shuffle {1}'s discard into their deck and have them draw a card",
            effectArgs: (context) => [context.game.activePlayer.opponent],
            gameAction: ability.actions.sequential([
                ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    target: context.game.activePlayer.opponent.discard
                })),
                ability.actions.draw((context) => ({
                    target: context.game.activePlayer.opponent
                }))
            ])
        });
    }
}

EddyOfDis.id = 'eddy-of-dis';

module.exports = EddyOfDis;
