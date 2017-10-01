const DrawCard = require('../../drawcard.js');

class LetGo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Choose an attachment – discard it.',
            target: {
                activePromptTitle: 'Select an attachment',
                cardType: 'attachment',
                cardCondition: card => card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} Was discarded', context.target);
                this.controller.removeAttachment(context.target);
            }
        });
    }
}

LetGo.id = 'let-go';

module.exports = LetGo;


