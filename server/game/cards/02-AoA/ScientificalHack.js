const Card = require('../../Card.js');

class ScientificalHack extends Card {
    // Omni: Sacrifice Scientifical Hack. For the remainder of the turn, you may use friendly artifacts as if they belonged to the active house.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forRemainderOfTurn({
                    effect: ability.effects.canUse((card) => card.type === 'artifact')
                })
            ]
        });
    }
}

ScientificalHack.id = 'scientifical-hack';

module.exports = ScientificalHack;
