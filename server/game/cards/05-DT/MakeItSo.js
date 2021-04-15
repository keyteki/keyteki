const Card = require('../../Card.js');

class MakeItSo extends Card {
    // Play: Choose a house. Reveal the top card of your deck. If that card belongs to the chosen house, draw it and trigger this effect again.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            effect: 'choose {1} and reveal {2}',
            effectArgs: (context) => [context.house, context.player.deck[0]],
            gameAction: ability.actions.reveal((context) => ({
                location: 'deck',
                target: context.player.deck[0]
            })),
            then: (preThenContext) => ({
                condition: () => preThenContext.player.deck[0].hasHouse(preThenContext.house),
                gameAction: ability.actions.draw(),
                then: {
                    // need to repeat reveal to avoid re-selecting a house in the resolve ability bellow
                    condition: (context) => context.player.deck.length > 0,
                    gameAction: ability.actions.reveal((context) => ({
                        location: 'deck',
                        target: context.player.deck[0]
                    })),
                    message: '{0} uses {1} to reveal {3}',
                    messageArgs: (context) => [context.player.deck[0]],
                    then: (preThenContext2) => ({
                        condition: () =>
                            preThenContext2.player.deck[0].hasHouse(preThenContext.house),
                        gameAction: ability.actions.draw(),
                        then: {
                            message: '{0} uses {1} to resolve its effect again',
                            gameAction: ability.actions.resolveAbility({
                                ability: preThenContext2.ability
                            })
                        }
                    })
                }
            })
        });
    }
}

MakeItSo.id = 'make-it-so';

module.exports = MakeItSo;
