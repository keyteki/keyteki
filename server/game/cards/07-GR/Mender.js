import Card from '../../Card.js';

class Mender extends Card {
    // Play/After Reap: Purge a card from a discard pile. Fully heal
    // and ward each Robot creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                controller: 'any',
                location: 'discard',
                gameAction: ability.actions.purge()
            },
            then: {
                alwaysTriggers: true,
                message: '{0} uses {1} to heal and ward {3}',
                messageArgs: (context) => [
                    context.game.creaturesInPlay.filter((c) => c.hasTrait('robot'))
                ],
                gameAction: ability.actions.sequential([
                    ability.actions.heal((context) => ({
                        target: context.game.creaturesInPlay.filter((c) => c.hasTrait('robot')),
                        fully: true
                    })),
                    ability.actions.ward((context) => ({
                        target: context.game.creaturesInPlay.filter((c) => c.hasTrait('robot'))
                    }))
                ])
            }
        });
    }
}

Mender.id = 'mender';

export default Mender;
