const Card = require('../../Card.js');

class BlankCheck extends Card {
    // Play: Each player shuffles their archives and discard pile into their deck. Discard the top 5 cards of your opponent's deck. Play the top card of their deck as if it were yours.
    setupCardAbilities(ability) {
        const playerShuffle = (context) =>
            ability.actions.returnToDeck({
                shuffle: true,
                shuffleDiscardIntoDeck: true,
                target: context.player.archives.concat(context.player.discard)
            });
        const opponentShuffle = (context) =>
            ability.actions.returnToDeck({
                shuffle: true,
                shufflePlayer: context.player.opponent,
                shuffleDiscardIntoDeck: true,
                target: context.player.opponent.archives.concat(context.player.opponent.discard)
            });

        const shuffleStep = (context) => {
            // No opponent: just shuffle the active player's archives/discard.
            if (!context.player.opponent) {
                return {
                    condition: false,
                    falseGameAction: playerShuffle(context)
                };
            }
            // Order-forced: prompt the active player for who shuffles first.
            if (context.player.optionSettings.orderForcedAbilities) {
                return {
                    condition: true,
                    trueGameAction: ability.actions.chooseAction({
                        activePromptTitle:
                            'Choose which player shuffles their archives and discard pile first',
                        choices: {
                            Me: [playerShuffle(context), opponentShuffle(context)],
                            Opponent: [opponentShuffle(context), playerShuffle(context)]
                        }
                    })
                };
            }
            // Default: active player shuffles first, then opponent.
            return {
                condition: true,
                trueGameAction: ability.actions.sequential([
                    playerShuffle(context),
                    opponentShuffle(context)
                ])
            };
        };

        const discardAndPlayStep = (context) => {
            // No opponent: nothing to discard or play.
            if (!context.player.opponent) {
                return { condition: false };
            }
            return {
                condition: true,
                trueGameAction: ability.actions.sequential([
                    ability.actions.discardTopOfDeck((context) => ({
                        target: context.player.opponent,
                        amount: 5
                    })),
                    ability.actions.playCard((context) => ({
                        revealOnIllegalTarget: true,
                        target: context.player.opponent.deck[0]
                    }))
                ])
            };
        };

        this.play({
            effect: 'have each player shuffle their archives and discard pile into their deck',
            gameAction: ability.actions.conditional(shuffleStep),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.conditional(discardAndPlayStep)
            }
        });
    }
}

BlankCheck.id = 'blank-check';

module.exports = BlankCheck;
