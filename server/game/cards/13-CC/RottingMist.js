const Card = require('../../Card.js');

class RottingMist extends Card {
    // Play: For the remainder of the turn, each enemy creature gets –1 power.
    setupCardAbilities(ability) {
        this.play({
            effect: 'give each enemy creature -1 power until the end of the turn',
            gameAction: ability.actions.forRemainderOfTurn({
                targetController: 'opponent',
                match: (card) => card.type === 'creature',
                effect: ability.effects.modifyPower(-1)
            })
        });
    }
}

RottingMist.id = 'rotting-mist';

module.exports = RottingMist;
