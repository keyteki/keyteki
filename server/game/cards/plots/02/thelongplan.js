const PlotCard = require('../../../plotcard.js');

class TheLongPlan extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeforeTaxation', 'afterChallenge']);
    }

    onBeforeTaxation(event, player) {
        if(!this.inPlay || this.controller !== player) {
            return;
        }

        event.cancel = true;
    }

    afterChallenge(event, challenge) {
        if(!this.inPlay || this.controller !== challenge.loser) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Gain 1 gold from ' + this.name + '?',
                buttons: [
                    { text: 'Yes', command: 'menuButton', method: 'gainGold' },
                    { text: 'No', command: 'menuButton', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });        
    }

    gainGold(player) {
        if(!this.inPlay || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to gain 1 gold from losing a challenge', player, this);

        player.gold++;

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

TheLongPlan.code = '02016';

module.exports = TheLongPlan;
