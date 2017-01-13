const DrawCard = require('../../../drawcard.js');

class BodyGuard extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onKillingCharacter: (event, player, card, allowSave) => {
                    if(this.parent === card && allowSave) {
                        event.cancel = true;
                        return true;
                    }

                    return false;
                }
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to save {2}', this.controller, this, this.parent);
                this.controller.sacrificeCard(this);
            },
            onCancel: () => {
                this.controller.killCharacter(this.parent, false);
                return true;
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
