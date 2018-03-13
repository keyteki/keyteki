const DrawCard = require('../../drawcard.js');

class ShinjoOutrider extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move this character to conflict',
            condition: context => context.source.allowGameAction('moveToConflict', context),
            handler: context => {
                this.game.addMessage('{0} moves {1} to the conflict by using its ability', this.controller, this);
                this.game.applyGameAction(context, { moveToConflict: context.source });
            }
        });
    }
}

ShinjoOutrider.id = 'shinjo-outrider';

module.exports = ShinjoOutrider;
