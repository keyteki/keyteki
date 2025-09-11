const Card = require('../../Card.js');

class MickeyTheCarver extends Card {
    // Hazardous 2.
    // After a player chooses an active house other than Shadows, steal 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event) => event.house !== 'shadows'
            },
            gameAction: ability.actions.steal()
        });
    }
}

MickeyTheCarver.id = 'mickey-the-carver';

module.exports = MickeyTheCarver;
