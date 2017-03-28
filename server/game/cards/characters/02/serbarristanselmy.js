const DrawCard = require('../../../drawcard.js');

class SerBarristanSelmy extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card, allowSave) => (
                    allowSave
                    && (card.hasTrait('Lord') || card.hasTrait('Lady'))
                    && card.controller === this.controller
                )
            },
            cost: ability.costs.standSelf(),
            canCancel: true,
            handler: context => {
                context.cancel();

                this.game.addMessage('{0} stands {1} to save {2}',
                                     this.controller, this, context.event.params[2]);
            }
        });
    }
}

SerBarristanSelmy.code = '02107';

module.exports = SerBarristanSelmy;
