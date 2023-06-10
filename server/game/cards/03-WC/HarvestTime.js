const Card = require('../../Card.js');

class HarvestTime extends Card {
    // Play: Choose a trait. Purge each card with that trait. Each player gains 1A for each card they controlled that was purged this way.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'trait'
            },
            effect:
                'purge all cards with the {1} trait and each player gains amber equal to the number of their cards purged',
            effectArgs: (context) => context.trait,
            gameAction: ability.actions.purge((context) => ({
                target: context.game.cardsInPlay.filter((card) => card.hasTrait(context.trait))
            })),
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvents.filter(
                            (event) => !event.cancelled && event.clone.controller === context.player
                        ).length
                    })),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount: context.preThenEvents.filter(
                            (event) =>
                                !event.cancelled &&
                                event.clone.controller === context.player.opponent
                        ).length
                    }))
                ]
            }
        });
    }
}

HarvestTime.id = 'harvest-time';

module.exports = HarvestTime;
