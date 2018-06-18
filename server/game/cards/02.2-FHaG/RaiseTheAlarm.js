const DrawCard = require('../../drawcard.js');

class RaiseTheAlarm extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Flip a dynasty card',
            condition: context => this.game.isDuringConflict('military') && context.player.isDefendingPlayer(),
            cannotBeMirrored: true,
            effect: 'flip the card in the conflict province faceup',
            gameAction: ability.actions.flipDynasty(context => ({
                target: context.player.controller.getDynastyCardInProvince(this.game.currentConflict.conflictProvince.location)
            })),
            then: context => ({
                handler: () => {
                    let card = context.player.controller.getDynastyCardInProvince(this.game.currentConflict.conflictProvince.location);
                    if(card.type === 'character' && card.allowGameAction('putIntoConflict', context)) {
                        this.game.addMessage('{0} is revealed and brought into the conflict!', card);
                        ability.actions.putIntoConflict().resolve(card, context);
                    } else {
                        this.game.addMessage('{0} is revealed but cannot be brought into the conflict!', card);
                    }
                }
            })
        });
    }
}

RaiseTheAlarm.id = 'raise-the-alarm';

module.exports = RaiseTheAlarm;
