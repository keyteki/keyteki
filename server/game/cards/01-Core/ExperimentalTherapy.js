const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class ExperimentalTherapy extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: Constants.Houses.map((house) => ability.effects.addHouse(house))
        });
        this.play({
            gameAction: [
                ability.actions.exhaust((context) => ({ target: context.source.parent })),
                ability.actions.stun((context) => ({ target: context.source.parent }))
            ]
        });
    }
}

ExperimentalTherapy.id = 'experimental-therapy';

module.exports = ExperimentalTherapy;
