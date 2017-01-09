const DrawCard = require('../../../drawcard.js');

class KingBalonsSolar extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onInitiativeDetermined']);
    }

    onInitiativeDetermined(event, player) {
        if(this.controller !== player || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Gain 1 gold', method: 'gainGold' },
                    { text: 'Cancel', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to trigger ' + this.name
        });
    }

    gainGold(player) {
        this.game.addGold(player, 1);

        this.game.addMessage('{0} uses {1} to gain 1 gold', player, this);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);
        
        return true;
    }
}

KingBalonsSolar.code = '04072';

module.exports = KingBalonsSolar;
