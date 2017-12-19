const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class TalismanOfTheSun extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move conflict to a different province',
            condition: () => this.controller.isDefendingPlayer(),
            cost: ability.costs.bowSelf(),
            handler: () => this.game.promptForSelect(this.controller, {
                source: this,
                cardType: 'province',
                gameAction: 'initiateConflict',
                cardCondition: card => card.controller === this.controller && card !== this.game.currentConflict.conflictProvince && !card.isBroken &&
                                       (card.location !== 'stronghold province' ||
                                        _.size(this.game.allCards.filter(card => card.isProvince && card.isBroken && card.controller === this.controller)) > 2),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1}, moving the conflict to {2}', this.controller, this, card);
                    card.inConflict = true;
                    this.game.currentConflict.conflictProvince.inConflict = false;
                    this.game.currentConflict.conflictProvince = card;
                    if(card.facedown) {
                        card.facedown = false;
                        this.game.raiseEvent('onProvinceRevealed', { conflict: this.game.currentConflict, province: card });
                    }
                    return true;
                }
            })
        });
    }
}

TalismanOfTheSun.id = 'talisman-of-the-sun';

module.exports = TalismanOfTheSun;
