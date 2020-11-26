const Card = require('../../Card.js');

class ThePaleStar extends Card {
    setupCardAbilities(ability) {
        this.omni({
            effect: 'make each creature to be 1 power and 0 amor',
            gameAction: [
                ability.actions.destroy(),
                ability.actions.forRemainderOfTurn({
                    targetController: 'any',
                    effect: [ability.effects.setPower(1), ability.effects.setArmor(0)]
                })
            ]
        });
    }
}

ThePaleStar.id = 'the-pale-star';

module.exports = ThePaleStar;
