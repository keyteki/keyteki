import Card from '../../Card.js';

class CodeMonkey extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Play: Archive each neighboring creature. If those creatures share a house, gain 2A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.gainAmber((context) => {
                    let card = context.source;
                    let neighbors = card.neighbors;
                    if (neighbors.length < 2) {
                        return {
                            amount: 0
                        };
                    }

                    const sharedHouses = neighbors[0]
                        .getHouses()
                        .some((house) => neighbors[1].getHouses().includes(house));

                    return {
                        amount: sharedHouses ? 2 : 0
                    };
                }),
                ability.actions.archive((context) => ({
                    target: context.source.neighbors
                }))
            ],
            message: '{0} uses {1} to archive {2} and gain {3} amber',
            messageArgs: (context) => [
                context.player,
                context.source,
                context.source.neighbors.length === 0 ? 'nothing' : context.source.neighbors,
                context.source.neighbors.length === 2 &&
                context.source.neighbors[0]
                    .getHouses()
                    .some((house) => context.source.neighbors[1].getHouses().includes(house))
                    ? 2
                    : 0
            ]
        });
    }
}

CodeMonkey.id = 'code-monkey';

export default CodeMonkey;
