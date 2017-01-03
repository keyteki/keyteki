const DrawCard = require('../../../drawcard.js');

class AshaGreyjoy extends DrawCard {
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
                menuTitle: 'Stand ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'stand' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to perform reactions'
        });
    }

    stand(player) {
        player.standCard(this);

        this.game.addMessage('{0} uses {1} to stand {1}', player, this, this);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }    
}

AshaGreyjoy.code = '01067';

module.exports = AshaGreyjoy;
