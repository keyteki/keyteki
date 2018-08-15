const Card = require('../../Card.js');

class Hysteria extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'return all creatures to their owner\'s hand',
            gameAction: ability.actions.returnToHand(context => ({ target: context.game.creaturesInPlay }))
        });
    }
}

Hysteria.id = 'hysteria'; // This is a guess at what the id might be - please check it!!!

module.exports = Hysteria;
