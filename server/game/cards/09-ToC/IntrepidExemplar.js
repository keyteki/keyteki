const Card = require('../../Card.js');

class IntrepidExemplar extends Card {
    // After Fight/Destroyed: Make a token creature.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.makeTokenCreature()
        });
        this.destroyed({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

IntrepidExemplar.id = 'intrepid-exemplar';

module.exports = IntrepidExemplar;
