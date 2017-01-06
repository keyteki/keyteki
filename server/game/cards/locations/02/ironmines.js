const DrawCard = require('../../../drawcard.js');
 
class IronMines extends DrawCard {
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
        this.game.addMessage('{0} uses {1} to save {2}', player, this, this.toKill);

        this.controller.sacrificeCard(this);

        return true;
    }

    cancel(player) {
        player.killCharacter(this.toKill, false);

        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

IronMines.code = '02092';

module.exports = IronMines;
