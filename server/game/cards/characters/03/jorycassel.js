const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');
 
class JoryCassel extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCharacterKilled']);
    }

    onCharacterKilled(event, player, card, allowSave) {
        if(!allowSave || player !== this.controller) {
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
        this.game.addMessage('{0} uses {1} to save {2}', player, this, this.toKill);

        this.controller.sacrificeCard(this);

        if(!_.any(this.game.getPlayers(), player => {
            return player.activePlot.hasTrait('Winter');
        })) {
            this.toKill.power++;
        }

        return true;
    }

    cancel(player) {
        player.killCharacter(this.toKill);

        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

JoryCassel.code = '03008';

module.exports = JoryCassel;
