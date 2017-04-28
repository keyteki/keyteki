const UiPrompt = require('./uiprompt.js');

class AttachmentPrompt extends UiPrompt {
    constructor(game, player, attachmentCard, playingType) {
        super(game);
        this.player = player;
        this.attachmentCard = attachmentCard;
        this.playingType = playingType;
    }

    activeCondition(player) {
        return player === this.player;
    }

    onCardClicked(player, targetCard) {
        var attachment = this.attachmentCard;
        var attachmentId = attachment.uuid;

        if(player !== this.player) {
            return false;
        }

        if(!player.canAttach(attachmentId, targetCard)) {
            return false;
        }

        var targetPlayer = this.game.getPlayerByName(targetCard.controller.name);
        targetPlayer.attach(player, attachment, targetCard.uuid, this.playingType);

        player.selectCard = false;
        this.complete();
    }

    onMenuCommand(player) {
        if(player !== this.player) {
            return false;
        }

        this.complete();
    }

    activePrompt() {
        return {
            selectCard: true,
            menuTitle: 'Select target for attachment',
            buttons: [
                { text: 'Done', arg: 'doneattachment' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to attach card' };
    }
}

module.exports = AttachmentPrompt;
