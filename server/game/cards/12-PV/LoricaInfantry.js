const Card = require('../../Card.js');

class LoricaInfantry extends Card {
    // After Fight: You may exalt Lorica Infantry. If you do, your opponent loses 2.
    setupCardAbilities(ability) {
        this.fight({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                message: '{0} uses {1} to make {3} lose 2 amber',
                messageArgs: (context) => [context.player.opponent],
                gameAction: ability.actions.loseAmber((context) => ({
                    target: context.player.opponent,
                    amount: 2
                }))
            }
        });
    }
}

LoricaInfantry.id = 'lorica-infantry';

module.exports = LoricaInfantry;
