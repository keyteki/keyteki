const StrongholdCard = require('../../strongholdcard.js');

class ShiroNishiyama extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give defending characters +1/+1',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict && this.controller.anyCardsInPlay(card => this.game.currentConflict.isDefending(card)),
            handler: () => {
                this.game.addMessage('{0} bows {1} to add +1/+1 to all defenders they control', this.controller, this);
                this.controller.cardsInPlay.each(card => {
                    if(card.isDefending()) {
                        this.untilEndOfConflict(ability => ({
                            match: card,
                            effect: [
                                ability.effects.modifyMilitarySkill(1),
                                ability.effects.modifyPoliticalSkill(1)
                            ]
                        }));
                    }
                });
            }
        });
    }
}

ShiroNishiyama.id = 'shiro-nishiyama';

module.exports = ShiroNishiyama;
