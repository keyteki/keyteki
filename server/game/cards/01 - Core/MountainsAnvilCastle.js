const StrongholdCard = require('../../strongholdcard.js');

class MountainsAnvilCastle extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character with attachments bonus skill',
            clickToActivate: true,
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict,
            target: {
                source: this,
                cardType: 'character',
                cardCondition: card => {
                    return (this.game.currentConflict.isParticipating(card) &&
                            card.attachments.size() > 0);
                }
            },
            handler: context => {
                this.game.addMessage('{0} bows {1} to give {2} (3)', this.controller, this, context.target, context.target.attachments.size > 1 ? '+2/+2' : '+1/+1');
                let modifier = 1;
                if(context.target.attachments.size > 1) {
                    modifier = 2;
                }
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyMilitarySkill(modifier),
                        ability.effects.modifyPoliticalSkill(modifier)
                    ]
                }));
            }
        });
    }
}

MountainsAnvilCastle.id = 'mountain-s-anvil-castle';

module.exports = MountainsAnvilCastle;
