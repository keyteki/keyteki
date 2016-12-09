const UiPrompt = require('./uiprompt.js');

class AttachmentPrompt extends UiPrompt {
    constructor(game, player, attachmentCard) {
        super(game);
        this.player = player;
        this.attachmentCard = attachmentCard;
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

        var targetPlayer = this.game.getPlayerById(targetCard.controller.id);
        if(targetPlayer === player && player.phase === 'setup') {
            // We put attachments on the board during setup, now remove it
            player.attach(player, attachment, targetCard.uuid);
            player.cardsInPlay = player.removeCardByUuid(player.cardsInPlay, attachmentId);
        } else {
            targetPlayer.attach(player, attachment, targetCard.uuid);
            player.removeFromHand(attachmentId);
        }

        if(player.dropPending) {
            player.discardPile = player.removeCardByUuid(player.discardPile, attachmentId);
        }

        player.dropPending = false;
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
                { text: 'Done', command: 'menuButton', arg: 'doneattachment' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to attach card' };
    }
}

module.exports = AttachmentPrompt;
