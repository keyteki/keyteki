const DrawCard = require('../../../drawcard.js');

class CerseisWheelhouse extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onFirstPlayerDetermined']);
    }

    onFirstPlayerDetermined(event, player) {
        if(!this.inPlay || this.controller !== player) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Gain 1 gold', method: 'gainGold' },
                    { text: 'Draw 1 card', method: 'drawCard' },
                    { text: 'Cancel', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to trigger ' + this.name
        });
    }

    gainGold(player) {
        player.gold++;

        this.game.addMessage('{0} uses {1} to gain 1 gold', player, this);

        return true;
    }

    drawCard(player) {
        player.drawCardsToHand(1);

        this.game.addMessage('{0} uses {1} to draw 1 card', player, this);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);
        
        return true;
    }    

    getInitiative() {
        return -1;
    }
}

CerseisWheelhouse.code = '02010';

module.exports = CerseisWheelhouse;
