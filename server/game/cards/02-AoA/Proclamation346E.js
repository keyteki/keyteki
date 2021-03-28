const Card = require('../../Card.js');

class Proclamation346E extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.player.opponent &&
                this.game.getHousesInPlay(context.player.opponent.creaturesInPlay).length < 3,
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(2)
        });
    }
}

Proclamation346E.id = 'proclamation-346e';

module.exports = Proclamation346E;
