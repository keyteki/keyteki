const Card = require('../../Card.js');

class TaxPilgrimage extends Card {
    //Play: A friendly creature captures 1A.
    //Each neighbor of that creature that shares a house with that creature also captures 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.capture()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.capture((context) => {
                    return {
                        target:
                            context.preThenEvent && context.preThenEvent.card
                                ? context.preThenEvent.card.neighbors.filter((neighbor) => {
                                      return neighbor
                                          .getHouses()
                                          .some((house) =>
                                              context.preThenEvent.card.hasHouse(house)
                                          );
                                  })
                                : []
                    };
                })
            }
        });
    }
}

TaxPilgrimage.id = 'tax-pilgrimage';

module.exports = TaxPilgrimage;
