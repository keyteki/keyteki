const Card = require('../../Card.js');

class OneLastJob extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'purge each friendly shadows creature and steal that much amber from {1}',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.purge((context) => ({
                target: context.player.creaturesInPlay.filter((card) => card.hasHouse('shadows'))
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.steal((context) => ({
                    amount: context.preThenEvents.filter((event) => !event.cancelled).length
                }))
            }
        });
    }
}

OneLastJob.id = 'one-last-job';

module.exports = OneLastJob;
