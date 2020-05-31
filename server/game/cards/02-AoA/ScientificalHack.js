const Card = require('../../Card.js');

class ScientificalHack extends Card {
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
