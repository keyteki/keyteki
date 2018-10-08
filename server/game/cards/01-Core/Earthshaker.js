const Card = require('../../Card.js');

class Earthshaker extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy(context => ({
                target: context.game.creaturesInPlay.filter(card => card.power <= 3)
            }))
        });
    }
}

Earthshaker.id = 'earthshaker'; // This is a guess at what the id might be - please check it!!!

module.exports = Earthshaker;
