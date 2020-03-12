const Card = require('../../Card.js');

class PlayerCardEffect extends Card {
    setupCardAbilities(ability) {
        console.log("Player card played!");
    }
}

PlayerCardEffect.id = 'player';

module.exports = PlayerCardEffect;
