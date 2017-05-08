const DrawCard = require('../../../drawcard.js');

class SaltWife extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice Salt Wife',
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.cannotBeDeclaredAsDefender()
                }));
                this.game.addMessage('{0} sacrifices {1} to make {2} unable to be declared as a defender', 
                                      context.player, this, context.target);
            }
        });
    }
}

SaltWife.code = '07027';

module.exports = SaltWife;
