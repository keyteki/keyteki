const DrawCard = require('../../../drawcard.js');

class Winterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.isFaction('stark') && card.getType() === 'character',
            effect: ability.effects.modifyStrength(1)
        });

        this.reaction({
            when: {
                onChallenge: () => true
            },
            costs: ability.costs.kneelSelf(),
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'any',
                    match: player => !player.activePlot.hasTrait('winter'),
                    effect: ability.effects.cannotTriggerCardAbilities()
                }));

                this.game.addMessage('{0} kneels {1} to prevent triggering card abilities', this.controller, this);
            }
        });
    }
}

Winterfell.code = '03017';

module.exports = Winterfell;
