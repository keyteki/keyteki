const PlotCard = require('../../../plotcard.js');

class TheLongPlan extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeforeTaxation', 'afterChallenge']);
    }

    onBeforeTaxation(event, player) {
        if(this.controller !== player) {
            return;
        }

        event.cancel = true;
    }

    afterChallenge(event, challenge) {
        if(this.controller !== challenge.loser) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Gain 1 gold from ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'gainGold' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });        
    }

    gainGold(player) {
        if(this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to gain 1 gold from losing a challenge', player, this);

        this.game.addGold(player, 1);

        return true;        
    }

    cancel(player) {
        if(this.controller !== player) {
            return false;
        }
        
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

TheLongPlan.code = '02016';

module.exports = TheLongPlan;
