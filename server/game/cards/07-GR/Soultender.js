const Card = require('../../Card.js');

class Soultender extends Card {
    // Play:/After Reap: Move each A from each Specter creature to the common
    // supply. Fully heal and ward each Specter creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.removeAmber((context) => ({
                all: true,
                target: context.game.creaturesInPlay.filter((c) => c.hasTrait('specter'))
            })),
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.heal((context) => ({
                        target: context.game.creaturesInPlay.filter((c) => c.hasTrait('specter')),
                        fully: true
                    })),
                    ability.actions.ward((context) => ({
                        target: context.game.creaturesInPlay.filter((c) => c.hasTrait('specter'))
                    }))
                ],
                message: '{0} uses {1} to heal and ward {3}',
                messageArgs: (context) => [
                    context.game.creaturesInPlay.filter((c) => c.hasTrait('specter'))
                ]
            }
        });
    }
}

Soultender.id = 'soultender';

module.exports = Soultender;
