const DrawCard = require('../../../drawcard.js');

class BodyGuard extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.cards.includes(this.parent) && event.allowSave,
                onCardsDiscarded: event => event.cards.includes(this.parent) && event.allowSave
            },
            handler: context => {
                context.event.saveCard(this.parent);
                this.game.addMessage('{0} sacrifices {1} to save {2}', this.controller, this, this.parent);
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
