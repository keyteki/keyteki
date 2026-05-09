const Card = require('../../Card.js');

class EdictOfConscription extends Card {
    // Action: Destroy Edict of Conscription. For the remainder of the turn, each friendly creature belongs to house Saurian.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.destroy((context) => ({
                target: context.source
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    effect: ability.effects.changeHouse('saurian'),
                    target: context.player.creaturesInPlay
                })),
                effect: 'make each friendly creature belong to house Saurian for the remainder of the turn'
            }
        });
    }
}

EdictOfConscription.id = 'edict-of-conscription';

module.exports = EdictOfConscription;
