const UiPrompt = require('./uiprompt.js');

class AttachmentPrompt extends UiPrompt {
    constructor(game, player, attachmentCard) {
        super(game);
        this.player = player;
        this.attachmentCard = attachmentCard;
        this.attached = false;
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

        var targetPlayer = this.game.getPlayerById(targetCard.owner.id);
        if(targetPlayer === player && player.phase === 'setup') {
            // We put attachments on the board during setup, now remove it
            player.attach(attachment, targetCard.uuid);
            player.cardsInPlay = player.removeCardByUuid(player.cardsInPlay, attachmentId);
        } else {
            targetPlayer.attach(attachment, targetCard.uuid);
            player.removeFromHand(attachmentId);
        }

        if(player.dropPending) {
            player.discardPile = player.removeCardByUuid(player.discardPile, attachmentId);
        }

        player.dropPending = false;
        player.selectCard = false;
        this.attached = true;
    }

    onMenuCommand(player) {
        if(player !== this.player) {
            return false;
        }

        this.attached = true;
    }

    setPrompt() {
        if(!this.attached) {
            this.originalPrompt = this.originalPrompt || this.player.currentPrompt();
            this.player.setPrompt({
                selectCard: true,
                menuTitle: 'Select target for attachment',
                buttons: [
                    { text: 'Done', command: 'menuButton', arg: 'doneattachment' }
                ]
            });
        } else {
            // TODO: Should not be necessary in the end, but is for now due to
            //       interrupts from drag/drop in the middle of steps not
            //       converted to the new engine.
            this.player.setPrompt(this.originalPrompt || {});
        }
    }

    continue() {
        this.setPrompt();
        return this.attached;
    }
}

module.exports = AttachmentPrompt;
