const Card = require('../../Card.js');

class Proclamation346E extends Card {
    // While your opponent does not control creatures from 3different houses, their keys cost +2A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.player.opponent &&
                context.game.getHousesInPlay(context.player.opponent.creaturesInPlay).length < 3,
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(2)
        });
    }
}

Proclamation346E.id = 'proclamation-346e';

module.exports = Proclamation346E;
