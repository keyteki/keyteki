const Card = require('../../Card.js');

class TrialByWater extends Card {
    // (T) Play: Reset the tide. Until the start of your next turn, players cannot raise the tide.
    setupCardAbilities(ability) {
        this.play({
            effect: 'prevent raising the tide until the start of their next turn',
            effectAlert: true,
            gameAction: [
                ability.actions.resetTide(),
                ability.actions.untilStartOfPlayerNextTurn({
                    targetController: 'any',
                    effect: ability.effects.playerCannot('raiseTide')
                })
            ]
        });
    }
}

TrialByWater.id = 'trial-by-water';

module.exports = TrialByWater;
