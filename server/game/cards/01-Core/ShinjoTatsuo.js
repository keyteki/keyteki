const DrawCard = require('../../drawcard.js');

class ShinjoTatsuo extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move this and another character to the conflict',
            condition: context => this.game.currentConflict && !this.isParticipating() && this.allowGameAction('moveToConflict', context),
            target: {
                cardType: 'character',
                optional: true,
                gameAction: 'moveToConflict',
                cardCondition: card => card.controller === this.controller && card.location === 'play area' && !card.isParticipating() && card !== this
            },
            handler: context => {
                let cards = [this];
                if(context.target !== 'noMoreTargets') {
                    cards.push(context.target);
                }
                this.game.addMessage('{0} uses {1} to move {2} to the conflict', this.controller, this, cards);
                this.game.currentConflict.moveToConflict(cards);
            }
        });
    }
}

ShinjoTatsuo.id = 'shinjo-tatsuo';

module.exports = ShinjoTatsuo;
