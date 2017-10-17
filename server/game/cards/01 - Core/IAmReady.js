const DrawCard = require('../../drawcard.js');

class IAmReady extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: (
                    card => card.location === 'play area' && 
                    card.fate > 0 && card.isFaction('unicorn') && 
                    card.controller === this.controller
                )
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready {2}', this.controller, this, context.target);
                context.target.modifyFate(-1);
                this.controller.readyCard(context.target);
            }
        });
    }
}

IAmReady.id = 'i-am-ready';

module.exports = IAmReady;
