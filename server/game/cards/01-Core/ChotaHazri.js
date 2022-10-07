const Card = require('../../Card.js');

class ChotaHazri extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({ target: context.player })),
            then: {
                gameAction: ability.actions.forgeKey({ may: true })
            }
        });
    }
}

ChotaHazri.id = 'chota-hazri';

module.exports = ChotaHazri;
