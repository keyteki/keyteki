const PlotCard = require('../../../plotcard.js');

class RiseOfTheKraken extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onUnopposedWin']);
    }

    onUnopposedWin(e, challenge) {
        var player = challenge.winner;
        if(!this.inPlay || this.controller !== player) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'gainPower' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    gainPower(player) {
        if(!this.inPlay || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to gain an additional power from winning an unopposed challenge', player, this);

        this.game.addPower(player, 1);

        return true;        
    }

    cancel(player) {
        if(!this.inPlay || this.controller !== player) {
            return false;
        }
        
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

RiseOfTheKraken.code = '02012';

module.exports = RiseOfTheKraken;
