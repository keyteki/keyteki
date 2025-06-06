const Card = require('../../Card.js');

class ClonalWitch extends Card {
    // Elusive.
    // After Reap: Choose a house. Destroy each creature of the chosen house.
    // For each creature destroyed this way, gain 1 amber. Put Clonal Witch on top of its owner's deck.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                mode: 'house'
            },
            effect: 'destroy each {1} creature',
            effectArgs: (context) => [context.house],
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse(context.house))
            })),
            then: {
                alwaysTriggers: true,
                message: '{0} uses {1} to gain {3} amber and put {1} on top of their deck',
                messageArgs: (context) => [
                    context.preThenEvents.filter((event) => !event.cancelled).length
                ],
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvents.filter((event) => !event.cancelled).length
                    })),
                    ability.actions.returnToDeck((context) => ({
                        target: context.source,
                        shuffle: false
                    }))
                ]
            }
        });
    }
}

ClonalWitch.id = 'clonal-witch';

module.exports = ClonalWitch;
