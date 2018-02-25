const DrawCard = require('../../drawcard.js');

class BorderRider extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: context => context.source.allowGameAction('ready', context),
            handler: context => {
                this.game.addMessage('{0} readies {1} using its ability', this.controller, this);
                this.game.applyGameAction(context, { ready: context.source });
            }
        });
    }
}

BorderRider.id = 'border-rider';

module.exports = BorderRider;


