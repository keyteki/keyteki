const DrawCard = require('../../../drawcard.js');
 
class RobbStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCharacterKilled', 'onSacrificed', 'onBeginRound']);
    }
    
    onBeginRound() {
        this.abilityUsed = false;
    }

    onCharacterKilled(event, player, card) {
        if(this.abilityUsed || player !== this.controller || card.getFaction() !== 'stark' || card.getType() !== 'character') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'stand' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use save effects'
        });
    }

    onSacrificed(event, player, card) {
        return this.onCharacterKilled(event, player, card);
    }

    stand(player) {
        this.controller.cardsInPlay.each(card => {
            if(card.getType() === 'character' && card.getFaction() === 'stark') {
                player.standCard(card);
            }
        });

        this.game.addMessage('{0} uses {1} to stand each {2} character they control', player, this, 'stark');

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

RobbStark.code = '01146';

module.exports = RobbStark;
