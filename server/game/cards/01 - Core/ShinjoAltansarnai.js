const DrawCard = require('../../drawcard.js');

class ShinjoAltansarnai extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onBreakProvince: event => event.conflict.conflictType === 'military' && this.isAttacking()
            },
            target: {
                activePromptTitle: 'Choose a character to discard',
                cardType: 'character',
                player: 'opponent',
                gameAction: 'discardCardFromPlay',
                cardCondition: card => card.controller !== this.controller && card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}, forcing {2} to discard {3}', this.controller, this, this.controller.opponent, context.target);
                this.controller.discardCardFromPlay(context.target);
            }
        });
    }
}

ShinjoAltansarnai.id = 'shinjo-altansarnai';

module.exports = ShinjoAltansarnai;
