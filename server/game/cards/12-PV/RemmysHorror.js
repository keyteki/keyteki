const Card = require('../../Card.js');

class RemmysHorror extends Card {
    // Play: Destroy a creature and an artifact. Purge a random card from your opponent's hand.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                creature: {
                    cardType: ['creature'],
                    controller: 'any',
                    gameAction: ability.actions.destroy()
                },
                artifact: {
                    cardType: ['artifact'],
                    controller: 'any',
                    gameAction: ability.actions.destroy()
                }
            },
            message: '{0} uses {1} to destroy {2}',
            messageArgs: (context) => [
                context.player,
                context.source,
                context.targets.creature === undefined
                    ? context.targets.artifact === undefined
                        ? 'nothing'
                        : context.targets.artifact
                    : [context.targets.creature].concat(
                          context.targets.artifact === undefined ? [] : [context.targets.artifact]
                      )
            ],
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.purgeAtRandom()
            }
        });
    }
}

RemmysHorror.id = 'remmy-s-horror';

module.exports = RemmysHorror;
