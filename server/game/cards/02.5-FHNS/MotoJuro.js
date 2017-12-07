const DrawCard = require('../../drawcard.js');

class MotoJuro extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character to the conflict or home from the conflict',
            limit: ability.limit.perRound(2),
            condition: context => this.game.currentConflict && ((!this.isParticipating() && this.allowGameAction('moveToConflict', context)) || this.isParticipating()),
            handler: () => {
                if(this.isParticipating()) {
                    this.game.addMessage('{0} moves {1} home by using its ability', this.controller, this);                    
                    this.game.currentConflict.sendHome(this);
                } else {
                    this.game.addMessage('{0} moves {1} to the conflict by using its ability', this.controller, this);  
                    this.game.currentConflict.moveToConflict(this);
                }
            }
        });
    }
}

MotoJuro.id = 'moto-juro';

module.exports = MotoJuro;
