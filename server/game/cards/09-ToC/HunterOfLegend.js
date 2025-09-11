const Card = require('../../Card.js');

class HunterOfLegend extends Card {
    // This creature gains skirmish and “After Fight: Make a token creature.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ skirmish: 1 }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.makeTokenCreature()
                })
            ]
        });
    }
}

HunterOfLegend.id = 'hunter-of-legend';

module.exports = HunterOfLegend;
