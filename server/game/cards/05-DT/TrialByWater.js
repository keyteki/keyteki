const Card = require('../../Card.js');

class TrialByWater extends Card {
    //Play: Reset the tide. Players cannot raise the tide until the start of your next turn.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.resetTide(),
                ability.actions.lastingEffect({
                    targetController: 'any',
                    effect: ability.effects.playerCannot('raiseTide')
                })
            ]
        });
    }
}

TrialByWater.id = 'trial-by-water';

module.exports = TrialByWater;
