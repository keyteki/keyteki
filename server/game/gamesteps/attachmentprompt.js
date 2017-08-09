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
            cardCondition: card => this.attachmentCard.owner.canAttach(this.attachmentCard, card),
            onSelect: (player, card) => {
                let targetPlayer = card.controller;
                targetPlayer.attach(player, this.attachmentCard, card, this.playingType);
                return true;
            }
        });
    }
}

module.exports = AttachmentPrompt;
