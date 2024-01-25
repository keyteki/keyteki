const Card = require('../../Card.js');

class PlagueWind extends Card {
    // Play: Until the end of the turn, each non-Mars creature gets -3 power.
    setupCardAbilities(ability) {
        this.play({
            effect: 'give each non-Mars creatures -3 power until the end of the turn',
            gameAction: ability.actions.forRemainderOfTurn({
                targetController: 'any',
                match: (card) => !card.hasHouse('mars'),
                effect: ability.effects.modifyPower(-3)
            })
        });
    }
}

PlagueWind.id = 'plague-wind';

module.exports = PlagueWind;
