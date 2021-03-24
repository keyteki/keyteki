const Card = require('../../Card.js');

class Card323 extends Card {
    //This creature deals no damage when fighting.
    //Play: Purge each other creature. If this creature leaves play, return to play all creatures purged this way.
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
            effect: 'return all creatures purged by ??? to play',
            gameAction: ability.actions.sequentialPutIntoPlay((context) => ({
                forEach: context.source.childCards,
                action: ability.actions.putIntoPlay()
            }))
        });
    }
}

Card323.id = 'card-323';

module.exports = Card323;
