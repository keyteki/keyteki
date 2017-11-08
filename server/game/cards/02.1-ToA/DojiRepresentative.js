const DrawCard = require('../../drawcard.js');

class DojiRepresentative extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character home',
            condition: () => this.game.currentConflict && this.isParticipating(),
            handler: () => {
                this.game.addMessage('{0} moves {1} home using its ability', this.controller, this);
                this.game.currentConflict.sendHome(this);
            }
        });
    }
}

DojiRepresentative.id = 'doji-representative';

module.exports = DojiRepresentative;
