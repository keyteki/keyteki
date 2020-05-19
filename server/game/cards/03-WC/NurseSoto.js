const Card = require('../../Card.js');

class NurseSoto extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            gameAction: ability.actions.heal((context) => ({
                amount: 3,
                target: context.player.creaturesInPlay.filter((card) =>
                    this.neighbors.includes(card)
                )
            }))
        });
    }
}

NurseSoto.id = 'nurse-soto';

module.exports = NurseSoto;
