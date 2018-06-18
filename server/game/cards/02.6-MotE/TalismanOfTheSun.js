const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class TalismanOfTheSun extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move conflict to a different province',
            condition: context => context.player.isDefendingPlayer(),
            cost: ability.costs.bowSelf(),
            effect: 'move the conflict to another province',
            handler: context => this.game.promptForSelect(context.player, {
                context: context,
                cardType: 'province',
                location: 'province',
                controller: 'self',
                cardCondition: card => card !== this.game.currentConflict.conflictProvince && !card.isBroken && (card.location !== 'stronghold province' ||
                                        _.size(this.game.provinceCards.filter(card => card.isBroken && card.controller === context.player)) > 2),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves the conflict to {1}', context.player, card);
                    card.inConflict = true;
                    this.game.currentConflict.conflictProvince.inConflict = false;
                    this.game.currentConflict.conflictProvince = card;
                    if(card.facedown) {
                        this.game.raiseEvent('onProvinceRevealed', { conflict: this.game.currentConflict, province: card }, () => card.facedown = false);
                    }
                    return true;
                }
            })
        });
    }
}

TalismanOfTheSun.id = 'talisman-of-the-sun';

module.exports = TalismanOfTheSun;
