const DrawCard = require('../../drawcard.js');

class UtakuYumino extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card for +2/+2',
            condition: () => this.game.currentConflict,
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perConflict(1),
            handler: () => {
                this.game.addMessage('{0} discards a card to give {1} +2/+2', this.controller, this);
                this.untilEndOfConflict(ability => ({
                    match: this,
                    effect: [
                        ability.effects.modifyMilitarySkill(2),
                        ability.effects.modifyPoliticalSkill(2)
                    ]
                }));
            }
        });
    }
}

UtakuYumino.id = 'utaku-yumino';

module.exports = UtakuYumino;
