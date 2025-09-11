const Card = require('../../Card.js');

class AdministratorRivet extends Card {
    // Play: Make a token creature. If you are haunted, each friendly
    // token creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isHaunted(),
                gameAction: ability.actions.capture((context) => ({
                    target: context.player.creaturesInPlay.filter((c) => c.isToken())
                })),
                message: '{0} uses {1} to capture 1 amber onto each friendly token creature'
            }
        });
    }
}

AdministratorRivet.id = 'administrator-rivet';

module.exports = AdministratorRivet;
