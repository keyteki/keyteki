const DrawCard = require('../../drawcard.js');

class LetGo extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose an attachment – discard it.',
            target: {
                activePromptTitle: 'Select an attachment',
                cardType: 'attachment',
                cardCondition: card => card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to discard {2}', this.controller, this, context.target);
                this.controller.removeAttachment(context.target);
            }
        });
    }
}

LetGo.id = 'let-go';

module.exports = LetGo;


