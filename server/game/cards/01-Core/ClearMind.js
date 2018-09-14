const Card = require('../../Card.js');

class ClearMind extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.removeStun(context => ({ target: context.player.creaturesInPlay }))
        });
    }
}

ClearMind.id = 'clear-mind'; // This is a guess at what the id might be - please check it!!!

module.exports = ClearMind;
