const Card = require('../../Card.js');

class ShisnyasiBuggy extends Card {
    //Action: Lose 1A. If you do, draw 3 cards.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.loseAmber((context) => ({
                amount: 1,
                target: context.player
            })),
            then: {
                gameAction: ability.actions.draw({ amount: 3 })
            }
        });
    }
}

ShisnyasiBuggy.id = 'shĭsnyasĭ-buggy';

module.exports = ShisnyasiBuggy;
