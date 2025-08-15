const Card = require('../../Card.js');

class AdministratorPelith extends Card {
    // After Reap: You may move a friendly Sanctum creature anywhere in your battleline.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('sanctum'),
                gameAction: ability.actions.moveOnBattleline((context) => ({
                    player: context.player
                }))
            },
            effect: 'move {1} anywhere in their battleline',
            effectArgs: (context) => [context.target]
        });
    }
}

AdministratorPelith.id = 'administrator-pelith';

module.exports = AdministratorPelith;
