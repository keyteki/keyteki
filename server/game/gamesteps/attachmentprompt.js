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
            activePromptTitle: 'Select target for attachment',
            cardCondition: card => this.player.canAttach(this.attachmentCard.uuid, card),
            onSelect: (player, card) => {
                let targetPlayer = card.controller;
                targetPlayer.attach(player, this.attachmentCard, card.uuid, this.playingType);
                return true;
            }
        });
    }
}

module.exports = AttachmentPrompt;
