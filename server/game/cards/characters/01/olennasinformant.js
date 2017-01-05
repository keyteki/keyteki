const DrawCard = require('../../../drawcard.js');

class OlennasInformant extends DrawCard {
    play(player) {
        super.play(player);

        if(player.phase !== 'challenge') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'trigger' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    trigger(player) {
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Name a challenge type',
                buttons: [
                    { text: 'Military', method: 'challengeSelected', arg: 'military' },
                    { text: 'Intrigue', method: 'challengeSelected', arg: 'intrigue' },
                    { text: 'Power', method: 'challengeSelected', arg: 'power' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }

    challengeSelected(player, challenge) {
        this.controller.addChallenge(challenge, 1);

        this.game.addMessage('{0} uses {1} to be able to initiate an additional {2} challenge this phase', player, this, challenge);

        return true;
    } 
}

OlennasInformant.code = '01189';

module.exports = OlennasInformant;
