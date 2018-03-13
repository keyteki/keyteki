const DrawCard = require('../../drawcard.js');

class DojiRepresentative extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move this character home',
            condition: context => context.source.allowGameAction('sendHome', context),
            handler: context => {
                this.game.addMessage('{0} moves {1} home using its ability', this.controller, this);
                this.game.applyGameAction(context, { sendHome: context.source });
            }
        });
    }
}

DojiRepresentative.id = 'doji-representative';

module.exports = DojiRepresentative;
