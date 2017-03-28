const DrawCard = require('../../../drawcard.js');

class IronMines extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card, allowSave) => card.controller === this.controller && allowSave
            },
            canCancel: true,
            handler: (context) => {
                context.cancel();
                this.game.addMessage('{0} sacrifices {1} to save {2}', this.controller, this, context.event.params[2]);

                this.controller.sacrificeCard(this);
            }
        });
    }
}

IronMines.code = '02092';

module.exports = IronMines;
