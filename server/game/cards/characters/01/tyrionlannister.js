const DrawCard = require('../../../drawcard.js');

class TyrionLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onChallenge', 'onBeginRound']);
    }

    onBeginRound() {
        this.abilityUsed = 0;
    }

    onChallenge(event, challenge) {
        if(challenge.challengeType !== 'intrigue' || this.abilityUsed >= 2) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'gainGold' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    gainGold(player) {
        player.gold += 2;

        this.game.addMessage('{0} uses {1} to gain 2 gold as an intrigue challenge has been declared', player, this);

        this.abilityUsed++;

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

TyrionLannister.code = '01089';

module.exports = TyrionLannister;
