const Card = require('../../Card.js');

class CodeMonkey extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.gainAmber(context => {
                    let card = context.source;
                    let neighbors = card.neighbors;
                    if(neighbors.length < 2) {
                        return {
                            amount: 0
                        };
                    }

                    const sharedHouses = neighbors[0].getHouses().some(house => neighbors[1].getHouses().includes(house));

                    return {
                        amount: sharedHouses ? 2 : 0
                    };
                }),
                ability.actions.archive(context => ({
                    target: context.source.neighbors
                }))
            ]
        });
    }
}

CodeMonkey.id = 'code-monkey';

module.exports = CodeMonkey;
