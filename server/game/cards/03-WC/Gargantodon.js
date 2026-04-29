const Card = require('../../Card.js');

class Gargantodon extends Card {
    // Gargantodon enters play stunned.
    // Gargantodon only deals 4D when fighting.
    // Each A that would be stolen is captured by a creature controlled by the active player instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayStunned()
        });

        this.persistentEffect({
            effect: ability.effects.limitFightDamage(4)
        });

        this.interrupt({
            when: {
                onStealAmber: () => true
            },
            effect: 'capture amber instead of stealing it',
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                cancel: true
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: preThenContext.event.amount,
                    action: ability.actions.capture((captureContext) => ({
                        amount: 1,
                        player: preThenContext.event.player,
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to capture amber',
                            cardType: 'creature',
                            cardCondition: (card) =>
                                card.controller === captureContext.game.activePlayer,
                            message: '{0} uses {1} to capture 1 amber on {2}',
                            messageArgs: (cards) => [
                                captureContext.game.activePlayer,
                                context.source,
                                cards
                            ]
                        }
                    }))
                }))
            })
        });
    }
}

Gargantodon.id = 'gargantodon';

module.exports = Gargantodon;
