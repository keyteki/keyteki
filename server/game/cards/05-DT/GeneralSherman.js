const Card = require('../../Card.js');

class GeneralSherman extends Card {
    // General Sherman deals no damage when fighting.
    // Play: Purge each other creature. If General Sherman leaves play, return to play each creature purged this way (exhausted and under its owner’s control).
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('dealFightDamage')
        });

        this.play({
            effect: 'purge each other creature',
            gameAction: ability.actions.purge((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card !== context.source)
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.placeUnder((context) => ({
                    moveGigantic: true,
                    parent: context.source,
                    target: context.preThenEvents
                        .filter((event) => !event.cancelled)
                        .map((event) => event.card)
                }))
            }
        });

        this.leavesPlay({
            effect: 'return all creatures purged by {0} to play',
            gameAction: ability.actions.sequentialPutIntoPlay((context) => ({
                forEach: context.source.childCards
            }))
        });
    }
}

GeneralSherman.id = 'general-sherman';

module.exports = GeneralSherman;
