const DrawCard = require('../../../drawcard.js');

class CerseiLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared', 'onCardDiscarded', 'onBeginRound']);
    }

    onBeginRound() {
        this.abilityUsed = 0;
    }

    onAttackersDeclared(e, challenge) {
        var player = challenge.attackingPlayer;
        if(this.controller !== player || challenge.challengeType !== 'intrigue') {
            return;
        }

        if(!this.isBlank() && challenge.isAttacking(this)) {
            player.standCard(this);
        }
    }

    onCardDiscarded(event, player, card) {
        if(this.controller === player || card.location !== 'hand' || this.abilityUsed >= 3 || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Gain 1 power on ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'gainPower' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    gainPower(player) {
        this.game.addMessage('{0} gains 1 power on {1} in reaction to a card being discarded from their opponents\'s hand', player, this);
        this.modifyPower(1);
        this.abilityUsed++;

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }    
}

CerseiLannister.code = '05001';

module.exports = CerseiLannister;
