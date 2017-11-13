const DrawCard = require('../../drawcard.js');

class DisdainfulRemark extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add Province Strength',
            condition: () => this.controller.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')) && this.controller.opponent.hand.size() > 0,
            handler: () => {
                let opponentHandSize = this.controller.opponent.hand.size();
                this.game.addMessage('{0} uses {1}\'s ability to add {2} to the province strength.', this.controller, this, opponentHandSize);
                this.untilEndOfConflict(ability => ({
                    match: this.game.currentConflict.conflictProvince,
                    targetLocation: 'province',
                    effect: ability.effects.modifyProvinceStrength(opponentHandSize)
                }));
            }
        });
    }
}

DisdainfulRemark.id = 'disdainful-remark';

module.exports = DisdainfulRemark;
