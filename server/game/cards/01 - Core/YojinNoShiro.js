const StrongholdCard = require('../../strongholdcard.js');

class YojinNoShiro extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give attacking characters +1/+0',
            clickToActivate: true,
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict && this.controller.anyCardsInPlay(card => card.isAttacking()),
            handler: () => {
                this.game.addMessage('{0} bows {1} to add +1/+0 to all attackers they control', this.controller, this);
                this.untilEndOfConflict(ability => ({
                    match: card => card.isAttacking() && card.controller === this.controller,
                    effect: ability.effects.modifyMilitarySkill(1)
                }));
            }
        });
    }
}

YojinNoShiro.id = 'yojin-no-shiro';

module.exports = YojinNoShiro;
