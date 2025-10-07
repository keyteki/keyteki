import Card from '../../Card.js';

class Technobabble extends Card {
    // Play: Stun a creature and each of its neighbors that shares a house with it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun((context) => ({
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

Technobabble.id = 'technobabble';

export default Technobabble;
