const Card = require('../../Card.js');

class ShĭSnyasĭBuggy extends Card {
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

ShĭSnyasĭBuggy.id = 'shisnyasi-buggy';

module.exports = ShĭSnyasĭBuggy;
