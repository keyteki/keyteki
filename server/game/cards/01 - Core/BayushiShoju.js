const DrawCard = require('../../drawcard.js');

class BayushiShoju extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character -1P',
            limit: ability.limit.perRound(2),
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political' && this.game.currentConflict.isParticipating(this),
            target: {
                source: this,
                cardType: 'character',
                cardCondition: card => this.game.currentConflict.isParticipating(card) && card.controller !== this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to reduce {2}\'s political skill by 1.  They will die if they reach 0', this.controller, this, context.target);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.discardByPoliticalSkill,
                        ability.effects.modifyPoliticalSkill(-1)
                    ]
                }));
            }
        });
    }
}

BayushiShoju.id = 'bayushi-shoju';

module.exports = BayushiShoju;
