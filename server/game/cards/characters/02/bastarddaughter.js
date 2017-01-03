const DrawCard = require('../../../drawcard.js');
 
class BastardDaughter extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCharacterKilled']);
    }

    onCharacterKilled(event, player, card) {
        if(player !== this.controller) {
            return;
        }

        if(card.name !== 'Bastard Daughter' && card.name !== 'The Red Viper') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'discard' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    discard(player) {
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return true;
        }

        this.game.addMessage('{0} uses {1} to dicard 1 card at random from {2}\'s hand', player, this, otherPlayer);

        otherPlayer.discardAtRandom(1);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

BastardDaughter.code = '02015';

module.exports = BastardDaughter;
