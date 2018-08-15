const Card = require('../../Card.js');

class KeyToDis extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.destroy(context => ({ target: context.game.creaturesInPlay }))
        });
    }
}

KeyToDis.id = 'key-to-dis'; // This is a guess at what the id might be - please check it!!!

module.exports = KeyToDis;
