const DrawCard = require('../../../drawcard.js');

class MaesterAemon extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => (
                    event.allowSave &&
                    event.card.isFaction('thenightswatch') &&
                    event.card.controller === this.controller
                )
            },
            cost: ability.costs.kneelSelf(),
            canCancel: true,
            handler: context => {
                context.cancel();
                this.game.addMessage('{0} kneels {1} to save {2}', this.controller, this, context.event.card);
            }
        });
    }
}

MaesterAemon.code = '01125';

module.exports = MaesterAemon;
