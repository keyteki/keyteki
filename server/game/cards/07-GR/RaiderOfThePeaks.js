const Card = require('../../Card.js');

class RaiderOfThePeaks extends Card {
    // At the start of your turn, the player who controls the most
    // powerful creature discards the top card of their deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) => context.player === this.game.activePlayer
            },
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'any',
                numCards: 1,
                cardStat: (card) => card.power
            },
            gameAction: ability.actions.discard((context) => ({
                target:
                    context.target &&
                    context.target.length > 0 &&
                    context.target[0].controller.deck.length > 0
                        ? context.target[0].controller.deck[0]
                        : null
            })),
            effect: 'make {1} discard the top card of their deck',
            effectArgs: (context) => [
                context.target && context.target.length > 0
                    ? context.target[0].controller
                    : 'no player'
            ]
        });
    }
}

RaiderOfThePeaks.id = 'raider-of-the-peaks';

module.exports = RaiderOfThePeaks;
