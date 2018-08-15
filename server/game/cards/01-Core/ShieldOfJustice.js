const Card = require('../../Card.js');

class ShieldOfJustice extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'prevent their creatures from taking damage this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.cardCannot('damage')
            })
        });
    }
}

ShieldOfJustice.id = 'shield-of-justice'; // This is a guess at what the id might be - please check it!!!

module.exports = ShieldOfJustice;
