const DrawCard = require('../../../drawcard.js');

class SerBarristanSelmy extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card, allowSave) => (
                    allowSave
                    && this.kneeled
                    && (card.hasTrait('Lord') || card.hasTrait('Lady'))
                    && card.controller === this.controller
                )
            },
            canCancel: true,
            title: context => 'Stand ' + this.name + ' to save ' + context.event.params[2].name,
            handler: context => {
                this.controller.standCard(this);
                context.cancel();
                this.game.addMessage('{0} stands {1} to save {2}',
                                     this.controller, this, context.event.params[2]);
            }
        });
    }
}

SerBarristanSelmy.code = '02107';

module.exports = SerBarristanSelmy;
