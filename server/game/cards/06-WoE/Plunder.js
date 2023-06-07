const _ = require('underscore');
const Card = require('../../Card.js');

class Plunder extends Card {
    // Play: Reveal a random unrevealed card from your opponent's
    // hand. Then, you may either repeat this effect or your opponent
    // discards the last revealed card.
    setupCardAbilities(ability) {
        this.revealedCards = [];

        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.opponent.hand.filter((card) => !this.revealedCards.includes(card))
                    .length > 0,
            gameAction: ability.actions.reveal((context) => ({
                location: 'hand',
                chatMessage: true,
                target: _.shuffle(
                    context.player.opponent.hand.filter(
                        (card) => !this.revealedCards.includes(card)
                    )
                )[0]
            })),
            message: "{0} uses {1} to reveal a random unrevealed card from {2}'s hand",
            messageArgs: (context) => [context.player, context.source, context.player.opponent],
            then: (preThenContext) => ({
                alwaysTriggers: true,
                target: {
                    mode: 'select',
                    choices: {
                        'Repeat this effect': ability.actions.resolveAbility((context) => {
                            let revealedCard = context.preThenEvent.card;
                            this.revealedCards.push(revealedCard);
                            return {
                                ability: preThenContext.ability
                            };
                        }),
                        'Discard this card': ability.actions.discard((context) => ({
                            target: context.preThenEvent.card
                        }))
                    }
                }
            })
        });
    }
}

Plunder.id = 'plunder';

module.exports = Plunder;
