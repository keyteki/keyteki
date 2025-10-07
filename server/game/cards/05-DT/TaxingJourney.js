import Card from '../../Card.js';

class TaxingJourney extends Card {
    // Play: A friendly creature captures 1A. Each of its neighbors that shares a house with it also captures 1A.
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

TaxingJourney.id = 'taxing-journey';

export default TaxingJourney;
