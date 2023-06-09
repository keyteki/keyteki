const Card = require('../../Card.js');

class ChotaHazri extends Card {
    // Play: Lose 1A. If you do, you may forge a key at current cost.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({ target: context.player })),
            then: {
                may: 'forge a key',
                gameAction: ability.actions.forgeKey()
            }
        });
    }
}

ChotaHazri.id = 'chota-hazri';

module.exports = ChotaHazri;
