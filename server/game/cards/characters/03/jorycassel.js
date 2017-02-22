const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JoryCassel extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card, allowSave) => (
                    allowSave &&
                    card.controller === this.controller &&
                    card.isUnique() &&
                    card.isFaction('stark')
                )
            },
            canCancel: true,
            title: context => 'Sacrifice ' + this.name + ' to save ' + context.event.params[2].name,
            handler: context => {
                context.cancel();
                var message = '{0} uses {1} to save {2}';
                var toKill = context.event.params[2];

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
