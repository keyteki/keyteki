const Card = require('../../Card.js');

class Tremor extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.action.stun(context => ({
                    target: context.target.neighbors.concat(context.target)
                }))
            }
        });
    }
}

Tremor.id = 'tremor'; // This is a guess at what the id might be - please check it!!!

module.exports = Tremor;
