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
            effect: 'prevent cards named {1} from being played or used',
            effectArgs: (context) => [context.cardName],
            gameAction: [
                ability.actions.duringOpponentNextTurn((context) => ({
                    targetController: 'any',
                    effect: [
                        ability.effects.playerCannot(
                            'play',
                            (innerContext) => innerContext.source.name === context.cardName
                        ),
                        ability.effects.cardCannot(
                            'use',
                            (effectContext) => effectContext.target.name === context.cardName
                        )
                    ]
                })),
                ability.actions.gainChains({ amount: 2 })
            ]
        });

        this.scrap({
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.discard.length > 0,
            target: {
                location: 'discard',
                controller: 'opponent',
                gameAction: ability.actions.purge()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    shufflePlayer: context.player.opponent,
                    target: context.player.opponent ? context.player.opponent.discard : []
                })),
                message: '{0} uses {1} to have {2} shuffle their discard pile into their deck',
                messageArgs: (context) => [context.player, context.source, context.player.opponent]
            }
        });
    }
}

VarghastsVengeance.id = 'varghast-s-vengeance';

module.exports = VarghastsVengeance;
