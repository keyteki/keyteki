const DrawCard = require('../../drawcard.js');

class ForShame extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Dishonor or bow a character',
            condition: () => this.controller.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            target: {
                cardType: 'character',
                cardCondition: card => card.controller !== this.controller && card.isParticipating() && (card.allowGameAction('bow') || card.allowGameAction('dishonor'))
            },
            handler: context => {
                if(!context.target.allowGameAction('bow')) {
                    this.game.addMessage('{0} uses {1} to dishonor {2}', context.player, this, context.target);
                    context.target.controller.dishonorCard(context.target, context.source);
                } else if(!context.target.allowGameAction('dishonor')) {
                    this.game.addMessage('{0} uses {1} to bow {2}', context.player, this, context.target);
                    context.target.controller.bowCard(context.target, context.source);                    
                } else {
                    this.game.promptWithHandlerMenu(context.target.controller, {
                        source: this,
                        choices: ['Dishonor this character', 'Bow this character'],
                        controls: { type: 'targeting', targets: [context.target] },
                        handlers: [
                            () => {
                                this.game.addMessage('{0} uses {1} to dishonor {2}', context.player, this, context.target);
                                this.controller.dishonorCard(context.target, context.source);                                
                            },
                            () => {
                                this.game.addMessage('{0} uses {1} to bow {2}', context.player, this, context.target);
                                this.controller.bowCard(context.target, context.source);                                
                            }
                        ]
                    });
                }
            }
        });
    }
}

ForShame.id = 'for-shame';

module.exports = ForShame;
