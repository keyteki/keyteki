const Card = require('../../Card.js');

class EntropicManipulator extends Card {
    // Play: Choose a player. You may redistribute the damage on the creatures that player controls among that players creatures. (You may cause more damage to a creature than it has power.)
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                activePromptTitle: "Which player's creatures do you want to affect",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            effect: "redistribute the damage on {1}'s creatures",
            effectArgs: (context) =>
                context.select === 'Mine' ? context.player : context.player.opponent,
            gameAction: ability.actions.removeDamage((context) => ({
                all: true,
                target:
                    context.select === 'Mine'
                        ? context.player.creaturesInPlay
                        : context.player.opponent.creaturesInPlay
            })),
            then: (preContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: context.preThenEvents
                        .filter((event) => !event.cancelled && event.amount > 0)
                        .reduce((total, event) => total + event.amount, 0),
                    action: ability.actions.addDamageToken({
                        noGameStateCheck: true,
                        promptForSelect: {
                            cardType: 'creature',
                            controller: preContext.select === 'Mine' ? 'self' : 'opponent'
                        }
                    })
                }))
            })
        });
    }
}

EntropicManipulator.id = 'entropic-manipulator';

module.exports = EntropicManipulator;
