const DrawCard = require('../../drawcard.js');

class RaiseTheAlarm extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Flip a dynasty card',
            condition: () => this.game.currentConflict && this.game.currentConflict.defendingPlayer === this.controller && this.game.currentConflict.conflictType === 'military',
            target: {
                cardCondition: card => {
                    return (['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) &&
                        card.isDynasty && card.facedown && card.controller === this.controller);
                }
            },
            handler: context => {
                context.target.facedown = false;
                if(context.target.type === 'character' && this.controller.canPutIntoPlay(context.target, true)) {
                    this.game.addMessage('{0} uses {1} to bring {2} into the conflict!', this.controller, this, context.target);
                    this.controller.putIntoPlay(context.target, true);
                }
                else {
                    this.game.addMessage('{0} uses {1} but cannot bring {2} into the conflict!', this.controller, this, context.target);
                }
            }
        });
    }
}

RaiseTheAlarm.id = 'raise-the-alarm';

module.exports = RaiseTheAlarm;
