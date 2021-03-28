const Card = require('../../Card.js');

class CowardsEnd extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each undamaged creature',
            gameAction: [
                ability.actions.gainChains({ amount: 3 }),
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => !card.hasToken('damage'))
                }))
            ]
        });
    }
}

CowardsEnd.id = 'coward-s-end';

module.exports = CowardsEnd;
