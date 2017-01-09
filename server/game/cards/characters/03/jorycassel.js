const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');
 
class JoryCassel extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onKillingCharacter']);
    }

    onKillingCharacter(event, player, card, allowSave) {
        if(!allowSave || player !== this.controller || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Use ' + this.name + ' to save ' + card.name + '?',
                buttons: [
                    { text: 'Yes', method: 'save' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use save effects'
        });

        this.toKill = card;

        event.cancel = true;
    }

    save(player) {
        var message = '{0} uses {1} to save {2}'; 

        this.controller.sacrificeCard(this);

        if(_.any(this.game.getPlayers(), player => {
            return player.activePlot.hasTrait('Winter');
        })) {
            this.toKill.modifyPower(1);

            message += ' and make it gain 1 power';
        }

        this.game.addMessage(player, this, this.toKill);

        return true;
    }

    cancel(player) {
        player.killCharacter(this.toKill, false);

        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

JoryCassel.code = '03008';

module.exports = JoryCassel;
