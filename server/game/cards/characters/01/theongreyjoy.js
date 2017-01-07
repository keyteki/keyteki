const DrawCard = require('../../../drawcard.js');

class TheonGreyjoy extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onUnopposedWin']);
    }

    onUnopposedWin(event, challenge) {
        var winner = challenge.winner;
        if(this.isBlank() || this.controller !== winner || !challenge.isParticipating(this)) {
            return;
        }

        this.game.promptWithMenu(winner, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Gain 1 power', method: 'gainPower' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to perform reactions'
        });
    }

    gainPower(player) {
        this.modifyPower(1);
        this.game.addMessage('{0} gains 1 power on {1} after winning an unopposed challenge', player, this);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

TheonGreyjoy.code = '01071';

module.exports = TheonGreyjoy;
