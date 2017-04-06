const DrawCard = require('../../../drawcard.js');

class Dracarys extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce character STR by 4',
            condition: () => this.game.currentChallenge,
            cost: ability.costs.kneel(card => card.name === 'Daenerys Targaryen' || card.hasTrait('Dragon')),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && this.game.currentChallenge.isParticipating(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to kneel {2} and give {3} -4 STR until the end of the phase', context.player, this, context.kneelingCostCard, context.target);
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyStrength(-4),
                        ability.effects.killByStrength
                    ]
                }));
            }
        });
    }
}

Dracarys.code = '01176';

module.exports = Dracarys;
