const Card = require('../../Card.js');

class Benny extends Card {
    // Elusive.
    // After Reap: Ready each other Martian creature.
    // Destroyed: If there are no other friendly Mars creatures, purge Benny.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.ready((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) => card !== context.source && card.hasTrait('martian')
                )
            }))
        });

        this.destroyed({
            condition: (context) =>
                !context.player.creaturesInPlay.some(
                    (card) => card !== context.source && card.hasHouse('mars')
                ),
            gameAction: ability.actions.purge((context) => ({
                target: context.source
            })),
            effect: 'purge {0} because there are no other friendly Mars creatures'
        });
    }
}

Benny.id = 'benny';

module.exports = Benny;
