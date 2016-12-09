const AllPlayerPrompt = require('../allplayerprompt.js');
const AttachmentPrompt = require('../attachmentprompt.js');

class CheckAttachmentsPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return !player.hasUnmappedAttachments();
    }

    activePrompt() {
        return {
            menuTitle: 'Select attachment locations',
            buttons: [
                { command: 'mapattachments', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to finish setup' };
    }

    onCardClicked(player, card) {
        if(player !== card.controller) {
            return false;
        }

        if(card.getType() !== 'attachment') {
            return false;
        }

        this.game.queueStep(new AttachmentPrompt(this.game, player, card));
    }
}

module.exports = CheckAttachmentsPrompt;
