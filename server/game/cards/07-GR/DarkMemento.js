const Card = require('../../Card.js');

class DarkMemento extends Card {
    // At the start of your turn, if you are not haunted, discard
    // cards from the top of your deck until you are haunted.
    //
    // Scrap: Discard the top card from a player‘s deck. If that player is
    // not haunted, repeat this effect.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) =>
                    context.player === this.game.activePlayer && !context.player.isHaunted()
            },
            condition: (context) => context.player.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck[0]
            })),
            then: (preThenContext) => ({
                condition: (context) => !context.player.isHaunted(),
                gameAction: ability.actions.resolveAbility({ ability: preThenContext.ability })
            })
        });

        this.scrap({
            target: {
                mode: 'select',
                activePromptTitle: "Which player's deck",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            effect: "discard the top cards of {1}'s deck and repeat if they are not haunted",
            effectArgs: (context) => [
                !context.select || context.select === 'Mine'
                    ? context.player
                    : context.player.opponent
            ],
            gameAction: ability.actions.conditional((context) => ({
                condition:
                    !context.select || context.select === 'Mine'
                        ? context.player.deck.length > 0
                        : context.player.opponent.deck.length > 0,
                trueGameAction: ability.actions.discard({
                    target:
                        !context.select || context.select === 'Mine'
                            ? context.player.deck[0]
                            : context.player.opponent.deck[0]
                })
            })),
            then: (preThenContext) => ({
                condition: (context) =>
                    !preThenContext.select || preThenContext.select === 'Mine'
                        ? !context.player.isHaunted()
                        : !context.player.opponent.isHaunted(),
                gameAction: ability.actions.resolveAbility({ ability: preThenContext.ability })
            })
        });
    }
}

DarkMemento.id = 'dark-memento';

module.exports = DarkMemento;
