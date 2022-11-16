const Card = require('../../Card.js');

class Recruit extends Card {
    // Play: Make a token creature. If you exalted a friendly creature this turn, archive Recruit.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
            // TODO If you exalted a friendly creature this turn, archive Recruit.
        });
    }
}

Recruit.id = 'recruit';

module.exports = Recruit;
