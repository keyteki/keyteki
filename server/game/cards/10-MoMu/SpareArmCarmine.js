const Card = require('../../Card.js');

class SpareArmCarmine extends Card {
    // After Reap: If there are more friendly Mutant creatures than
    // enemy Mutant creatures, steal 2A. Otherwise, steal 1A.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.steal((context) => ({
                amount:
                    context.player.creaturesInPlay.filter((c) => c.hasTrait('mutant')).length >
                    context.player.opponent.creaturesInPlay.filter((c) => c.hasTrait('mutant'))
                        .length
                        ? 2
                        : 1
            }))
        });
    }
}

SpareArmCarmine.id = 'spare-arm-carmine';

module.exports = SpareArmCarmine;
