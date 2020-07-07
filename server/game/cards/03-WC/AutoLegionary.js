const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class AutoLegionary extends Card {
    setupCardAbilities(ability) {
        let effects = [ability.effects.changeType('creature')];

        effects = effects.concat(Constants.Houses.map((house) => ability.effects.addHouse(house)));

        this.action({
            gameAction: ability.actions.sequential([
                ability.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    duration: 'lastingEffect',
                    effect: effects.concat(ability.effects.setPower(5))
                })),
                ability.actions.moveToFlank()
            ])
        });
    }
}

AutoLegionary.id = 'auto-legionary';

module.exports = AutoLegionary;
