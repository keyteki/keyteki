const DrawCard = require('../../drawcard.js');

class KitsukiYaruma extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(context => context.source.hasTrait('poison'))
        });
        this.reaction({
            title: 'Flip province facedown',
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                cardType: 'province',
                cardCondition: card => !card.isBroken && !card.facedown
            },
            handler: context => {
                context.target.leavesPlay();
                if(this.game.currentConflict && this.game.currentConflict.conflictProvince === context.target) {
                    this.game.addMessage('{0} uses {1} to turn {2} facedown, but it is immediately revealed again', this.controller, this, context.target);
                    context.target.inConflict = true;
                    this.game.raiseEvent('onProvinceRevealed', { conflict: this.game.currentConflict, province: context.target });
                    return;
                }
                this.game.addMessage('{0} uses {1} to turn {2} facedown', this.controller, this, context.target);
                context.target.facedown = true;
            }
        });
    }
}

KitsukiYaruma.id = 'kitsuki-yaruma';

module.exports = KitsukiYaruma;
