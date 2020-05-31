const Card = require('../../Card.js');

class KeyToDis extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.destroy((context) => ({ target: context.game.creaturesInPlay }))
            ]
        });
    }
}

KeyToDis.id = 'key-to-dis';

module.exports = KeyToDis;
