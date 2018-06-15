const UiPrompt = require('./uiprompt.js');

class AttachmentPrompt extends UiPrompt {
    constructor(game, player, attachmentCard, playingType) {
        super(game);
        this.player = player;
        this.attachmentCard = attachmentCard;
        this.playingType = playingType;
    }

    continue() {
        this.game.promptForSelect(this.player, {
            source: 'Play Attachment',
            activePromptTitle: 'Select target for attachment',
            cardCondition: card => this.attachmentCard.owner.canAttach(this.attachmentCard, card),
            onSelect: (player, card) => {
                player.attach(this.attachmentCard, card);
                return true;
            }
        });
    }
}

module.exports = AttachmentPrompt;
