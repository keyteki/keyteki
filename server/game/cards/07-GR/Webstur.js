const Card = require('../../Card.js');

class Webstur extends Card {
    // After Fight: For each damage on Webstur, you may discard the top card
    // of each player's deck.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.source.tokens.damage,
                action: ability.actions.chooseAction({
                    activePromptTitle: 'Discard',
                    choices: {
                        Yes: ability.actions.discard((context) => ({
                            target: context.player.deck
                                .slice(0, 1)
                                .concat(
                                    context.player.opponent
                                        ? context.player.opponent.deck.slice(0, 1)
                                        : []
                                )
                        })),
                        No: []
                    },
                    messages: {
                        Yes: "{0} chooses to discard the top card of each player's deck",
                        No: "{0} chooses not to discard the top card of each player's deck"
                    }
                })
            }))
        });
    }
}

Webstur.id = 'webstur';

module.exports = Webstur;
