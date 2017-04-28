const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JoryCassel extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: event => (
                    event.allowSave &&
                    event.card.controller === this.controller &&
                    event.card.isUnique() &&
                    event.card.isFaction('stark')
                )
            },
            canCancel: true,
            handler: context => {
                context.cancel();
                var message = '{0} uses {1} to save {2}';
                var toKill = context.event.card;

                this.controller.sacrificeCard(this);

                if(_.any(this.game.getPlayers(), player => {
                    return player.activePlot.hasTrait('Winter');
                })) {
                    toKill.modifyPower(1);

                    message += ' and make it gain 1 power';
                }

                this.game.addMessage(message, this.controller, this, toKill);
            }
        });
    }
}

JoryCassel.code = '03008';

module.exports = JoryCassel;
