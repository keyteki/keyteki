const _ = require('underscore');

const Card = require('../../Card.js');

class Jargogle extends Card {
    // Elusive.
    // Play: Put a card from your hand facedown under Jargogle.
    // Destroyed: If it is your turn, play the card under Jargogle; otherwise, archive that card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.placeUnder((context) => ({
                    parent: context.source,
                    facedown: true
                }))
            }
        });

        this.destroyed({
            condition: (context) => context.source.childCards.length > 0,
            effect: '{1}{2}',
            effectArgs: (context) => {
                const isActive = context.game.activePlayer === context.player;
                if (!isActive) {
                    return ['archive ', 'a card'];
                }

                if (context.source.childCards.length === 1) {
                    return ['play ', context.source.childCards[0]];
                }

                return ['play a card from under ', context.source];
            },
            gameAction: ability.actions.conditional({
                condition: (context) => context.game.activePlayer === context.player,
                trueGameAction: ability.actions.conditional({
                    condition: (context) => context.source.childCards.length === 1,
                    trueGameAction: ability.actions.playCard((context) => ({
                        target: context.source.childCards
                    })),
                    falseGameAction: ability.actions.playCard({
                        promptForSelect: {
                            activePromptTitle: 'Choose a card to play',
                            location: 'any',
                            controller: 'any',
                            cardCondition: (card, context) =>
                                context.source.childCards.includes(card)
                        }
                    })
                }),
                falseGameAction: ability.actions.archive((context) => ({
                    target: _.sample(context.source.childCards)
                }))
            })
        });
    }
}

Jargogle.id = 'jargogle';

module.exports = Jargogle;
