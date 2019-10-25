const Card = require('../../Card.js');

class CodeMonkey extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'archive each neighboring creature and gain 2 amber for each house they share with {0}',
            gameAction: ability.actions.archive(context => ({
                target: context.source.neighbors
            })),
            then: {
                gameAction: ability.actions.gainAmber(context => {
                    let card = context.source;
                    let houses = card.getHouses();

                    let neighborsSharingHouses = card.neighbors.filter(c => c.getHouses().some(h => houses.includes(h)));
                    return {
                        target: card,
                        amount: neighborsSharingHouses.length
                    };
                })
            }
        });
    }
}

CodeMonkey.id = 'code-monkey';

module.exports = CodeMonkey;
