const DrawCard = require('../../../drawcard.js');

class MaesterAemon extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card, allowSaves) => (
                    allowSaves &&
                    card.isFaction('thenightswatch') &&
                    card.controller === this.controller
                )
            },
            cost: ability.costs.kneelSelf(),
            canCancel: true,
            handler: context => {
                context.cancel();
                this.game.addMessage('{0} kneels {1} to save {2}', this.controller, this, context.event.params[2]);
            }
        });
    }
}

MaesterAemon.code = '01125';

module.exports = MaesterAemon;
