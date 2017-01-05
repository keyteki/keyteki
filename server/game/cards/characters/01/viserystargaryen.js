const DrawCard = require('../../../drawcard.js');
 
class ViserysTargaryen extends DrawCard {
    leavesPlay() {
        if(this.isBlank()) {
            return;
        }
        
        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'discard' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        super.leavesPlay();        
    }

    discard(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select an attachment to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);
        
        return true;
    }

    cardCondition(card) {
        return card.getType() === 'attachment';
    }

    onCardSelected(player, attachment) {
        attachment.owner.discardCard(attachment);

        this.game.addMessage('{0} uses {1} to discard {2}', player, this, attachment);

        return true;
    }
}

ViserysTargaryen.code = '01167';

module.exports = ViserysTargaryen;
