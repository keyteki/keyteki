const Card = require('../../Card.js');

class GedHammer extends Card {
    //Destroyed: Ready and enrage each other friendly Brobnar creature.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.sequential([
                ability.actions.ready(),
                ability.actions.enrage()
            ])
        });
    }
}

GedHammer.id = 'ged-hammer';

module.exports = GedHammer;
