const Card = require('../../Card.js');

class VarghastsVengeance extends Card {
    // Omni: Name a card. Until the start of your next turn, cards with that
    // name cannot be played or used. Gain 2 chains.
    // Scrap: Purge a card from your opponent's discard pile. Your opponent
    // shuffles their discard pile into their deck.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                mode: 'card-name'
            },
            effect: 'prevent cards named {1} from being played or used until the start of their next turn',
            effectArgs: (context) => [context.cardName],
            gameAction: [
                ability.actions.untilPlayerNextTurnStart((context) => ({
                    targetController: 'any',
                    effect: [
                        ability.effects.playerCannot(
                            'play',
                            (innerContext) => innerContext.source.name === context.cardName
                        ),
                        ability.effects.cardCannot(
                            'use',
                            (innerContext) => innerContext.source.name === context.cardName
                        )
                    ]
                })),
                ability.actions.gainChains({ amount: 2 })
            ]
        });

        this.scrap({
            condition: (context) => !!context.player.opponent,
            preferActionPromptMessage: true,
            gameAction: ability.actions.conditional((context) => ({
                condition: context.player.opponent.discard.length > 0,
                trueGameAction: ability.actions.purge({
                    promptForSelect: {
                        location: 'discard',
                        controller: 'opponent',
                        message: '{0} uses {1} to purge {2}',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    }
                })
            })),
            then: {
                alwaysTriggers: true,
                message: '{0} uses {1} to have {3} shuffle their discard pile into their deck',
                messageArgs: (context) => [context.player.opponent],
                gameAction: ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    shufflePlayer: context.player.opponent,
                    target: context.player.opponent ? context.player.opponent.discard : []
                }))
            }
        });
    }
}

VarghastsVengeance.id = 'varghast-s-vengeance';

module.exports = VarghastsVengeance;
