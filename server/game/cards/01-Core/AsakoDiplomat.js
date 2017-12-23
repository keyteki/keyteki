const DrawCard = require('../../drawcard.js');

class AsakoDiplomat extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor or dishonor a character',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && event.conflict.isParticipating(this)
            },
            target: {
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: 'character',
                cardCondition: (card, context) => card.location === 'play area' && (card.allowGameAction('dishonor', context) || card.allowGameAction('honor', context))
            },
            handler: context => {
                if(!context.target.allowGameAction('dishonor', context)) {
                    this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, context.target);
                    this.controller.honorCard(context.target, context.source);
                } else if(!context.target.allowGameAction('honor', context)) {
                    this.game.addMessage('{0} uses {1} to dishonor {2}', this.controller, this, context.target);
                    this.controller.dishonorCard(context.target, context.source);                    
                } else {
                    let choices = [];
                    choices.push('Honor ' + context.target.name);
                    choices.push('Dishonor ' + context.target.name);
                    this.game.promptWithHandlerMenu(this.controller, {
                        source: this,
                        choices: choices,
                        handlers: [
                            () => {
                                this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, context.target);
                                this.controller.honorCard(context.target, context.source);
                            },
                            () => {
                                this.game.addMessage('{0} uses {1} to dishonor {2}', this.controller, this, context.target);
                                this.controller.dishonorCard(context.target, context.source);                                
                            }
                        ]
                    });
                }
            }
        });
    }
}

AsakoDiplomat.id = 'asako-diplomat';

module.exports = AsakoDiplomat;
