const DrawCard = require('../../drawcard.js');

class MotoJuro extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character to the conflict or home from the conflict',
            limit: ability.limit.perRound(2),
            condition: context => this.allowGameAction('moveToConflict', context) || this.allowGameAction('sendHome', context),
            handler: context => {
                if(this.isParticipating()) {
                    this.game.addMessage('{0} moves {1} home by using its ability', this.controller, this);                    
                    this.game.applyGameAction(context, { sendHome: context.source });
                } else {
                    this.game.addMessage('{0} moves {1} to the conflict by using its ability', this.controller, this);  
                    this.game.applyGameAction(context, { moveToConflict: context.source });
                }
            }
        });
    }
}

MotoJuro.id = 'moto-juro';

module.exports = MotoJuro;
