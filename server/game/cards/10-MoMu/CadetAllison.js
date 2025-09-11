const GiganticCard = require('../../GiganticCard.js');

class CadetAllison extends GiganticCard {
    // (Play only with the other half of Cadet Allison.)
    // Play/After Reap: Discard a random card from your hand. If you do, the
    // discarded card’s house becomes your active house.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            reap: true,
            gameAction: ability.actions.discardAtRandom((context) => ({
                target: context.source.controller
            })),
            then: {
                target: {
                    mode: 'house',
                    houses: (context) =>
                        context.preThenEvents.length > 0 &&
                        context.preThenEvents[0].cards.length > 0
                            ? context.preThenEvents[0].cards[0].getHouses()
                            : []
                },
                gameAction: ability.actions.changeActiveHouse((context) => ({
                    house: context.house
                })),
                message: '{0} uses {1} to change the active house to {3}',
                messageArgs: (context) => [context.house]
            }
        });
    }
}

CadetAllison.id = 'cadet-allison';

module.exports = CadetAllison;
