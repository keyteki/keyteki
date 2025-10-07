import Card from '../../Card.js';

class Dragnet extends Card {
    // Play: Return a creature and each neighbor that shares a house with it to their owners' hands.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.returnToHand((context) => ({
                    target: context.target
                        ? [context.target].concat(
                              context.target.neighbors.filter((neighbor) =>
                                  neighbor
                                      .getHouses()
                                      .some((house) => context.target.hasHouse(house))
                              )
                          )
                        : []
                }))
            }
        });
    }
}

Dragnet.id = 'dragnet';

export default Dragnet;
