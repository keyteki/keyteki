const Card = require('../../Card.js');

class ThePromisedBlade extends Card {
    // At the start of each player's turn, the player with the fewest creatures in play takes control of The Promised Blade.
    // Omni: A friendly creature captures 1 amber.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture(() => ({
                    amount: 1
                }))
            }
        });

        // Even creature count, active player chooses
        this.reaction({
            when: {
                onBeginRound: (_, context) =>
                    !!context.source.controller.opponent &&
                    context.source.controller.creaturesInPlay.length ===
                        context.source.controller.opponent.creaturesInPlay.length
            },
            targets: {
                select: {
                    mode: 'select',
                    activePromptTitle: 'Select a player to take control of this card',
                    choices: {
                        Me: () => true,
                        Opponent: () => true
                    }
                },
                then: {
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(
                            context.selects.select.choice === 'Me'
                                ? context.game.activePlayer
                                : context.game.activePlayer.opponent
                        )
                    }))
                }
            }
        });

        // Uneven creature count, automatic
        this.reaction({
            when: {
                onBeginRound: (_, context) =>
                    !!context.source.controller.opponent &&
                    context.source.controller.creaturesInPlay.length >
                        context.source.controller.opponent.creaturesInPlay.length
            },
            gameAction: ability.actions.cardLastingEffect((context) => ({
                duration: 'lastingEffect',
                effect: ability.effects.takeControl(context.source.controller.opponent)
            }))
        });
    }
}

ThePromisedBlade.id = 'the-promised-blade';

module.exports = ThePromisedBlade;
