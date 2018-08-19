const Card = require('../../Card.js');

class LootTheBodies extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'gain 1 amber each time an enemy is destroyed for the remainder of the turn',
            gameAction: ability.action.forRemainderOfTurn({
                effect: ability.effect.delayedEffect() //TODO
            })
        });
    }
}

LootTheBodies.id = 'loot-the-bodies'; // This is a guess at what the id might be - please check it!!!

module.exports = LootTheBodies;
