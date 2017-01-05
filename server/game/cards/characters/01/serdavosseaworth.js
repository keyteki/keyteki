const DrawCard = require('../../../drawcard.js');
 
class SerDavosSeaworth extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCharacterKilled']);
    }

    onCharacterKilled(event, player, card) {
        if(player !== this.controller || card !== this || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'returnToHand' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    returnToHand(player) {
        this.game.addMessage('{0} uses {1} to return {1} to their hand instead of their dead pile', player, this, this);

        player.moveCard(this, 'hand');

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

SerDavosSeaworth.code = '01050';

module.exports = SerDavosSeaworth;
