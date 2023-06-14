const Card = require('../../Card.js');

class InstrumentOfSilence extends Card {
    // This creature gains skirmish and, Fight: Gain 1.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ skirmish: 1 }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.gainAmber()
                })
            ]
        });
    }
}

InstrumentOfSilence.id = 'instrument-of-silence';

module.exports = InstrumentOfSilence;
