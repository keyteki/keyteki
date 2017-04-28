const DrawCard = require('../../../drawcard.js');

class SerBarristanSelmy extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => (
                    event.allowSave
                    && (event.card.hasTrait('Lord') || event.card.hasTrait('Lady'))
                    && event.card.controller === this.controller
                )
            },
            cost: ability.costs.standSelf(),
            canCancel: true,
            handler: context => {
                context.cancel();

                this.game.addMessage('{0} stands {1} to save {2}',
                                     this.controller, this, context.event.card);
            }
        });
    }
}

SerBarristanSelmy.code = '02107';

module.exports = SerBarristanSelmy;
