const DrawCard = require('../../drawcard.js');

class BayushiYunako extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch a character\'s M and P skill',
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this),
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.cardData.military !== undefined && card.cardData.political !== undefined
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to switch {2}\'s military and political skill', this.controller, this, context.target);
                let diff = context.target.baseMilitarySkill - context.target.basePoliticalSkill;
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyBaseMilitarySkill(-diff),
                        ability.effects.modifyBasePoliticalSkill(diff)
                    ]
                }));
            }
        });
    }
}

BayushiYunako.id = 'bayushi-yunako';

module.exports = BayushiYunako;
