const DrawCard = require('../../drawcard.js');

class VenerableHistorian extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor this character',
            condition: context => this.isParticipating() && this.allowGameAction('honor', context) && 
                                  this.controller.opponent && this.controller.opponent.honor < this.controller.honor,
            handler: context => {
                this.game.addMessage('{0} uses {1} to honor itself', context.player, context.source);
                this.game.applyGameAction(context, { honor: context.source });
            }
        });
    }
}

VenerableHistorian.id = 'venerable-historian';

module.exports = VenerableHistorian;
