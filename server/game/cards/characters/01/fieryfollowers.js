const DrawCard = require('../../../drawcard.js');
 
class FieryFollowers extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPhaseStarted']);
    }

    onPhaseStarted(event, phase) {
        if(phase !== 'dominance' || !this.kneeled) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Stand ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'stand' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    stand(player) {
        this.game.addMessage('{0} uses {1} to stand {1}', player, this);

        this.kneeled = false;

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

FieryFollowers.code = '01054';

module.exports = FieryFollowers;
