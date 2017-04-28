const DrawCard = require('../../../drawcard.js');

class BodyGuard extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: event => this.parent === event.card && event.allowSave,
                onCardDiscarded: event => event.card === this.parent && event.allowSave
            },
            canCancel: true,
            handler: (context) => {
                context.cancel();
                this.game.addMessage('{0} uses {1} to save {2}', this.controller, this, this.parent);
                this.controller.sacrificeCard(this);
            }
        });
    }

    canAttach(player, card) {
        if(!card.hasTrait('Lady') && !card.hasTrait('Lord')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

BodyGuard.code = '01033';

module.exports = BodyGuard;
