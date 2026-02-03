const Card = require('../../Card.js');

class StrongerTogether extends Card {
    // Play: Ready each Star Alliance creature that has 2 non-Star
    // Alliance neighbors of different houses.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequentialForEach((context) => ({
                forEach: context.player.creaturesInPlay.filter(
                    (card) =>
                        card.hasHouse('staralliance') &&
                        card.neighbors.length == 2 &&
                        !card.neighbors[0].hasHouse('staralliance') &&
                        !card.neighbors[1].hasHouse('staralliance') &&
                        card.neighbors[0]
                            .getHouses()
                            .some((house) => !card.neighbors[1].hasHouse(house))
                ),
                action: ability.actions.ready()
            })),
            effect: 'ready each Star Alliance creature that has 2 non-Star Alliance neighbors of different houses'
        });
    }
}

StrongerTogether.id = 'stronger-together';

module.exports = StrongerTogether;
