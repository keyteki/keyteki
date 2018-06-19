const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ChasingTheSun extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to another eligible province',
            condition: context => context.player.isAttackingPlayer(),
            cannotBeMirrored: true,
            effect: 'move the conflict to a different province',
            handler: context => this.game.promptForSelect(context.player, {
                context: context,
                cardType: 'province',
                location: 'province',
                cardCondition: (card, context) => !card.isConflictProvince() && (card.location !== 'stronghold province' ||
                                                  _.size(this.game.provinceCards.filter(card => card.isBroken && card.controller === context.player.opponent)) > 2),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves the conflict to {1}', player, card);
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

ChasingTheSun.id = 'chasing-the-sun';

module.exports = ChasingTheSun;
