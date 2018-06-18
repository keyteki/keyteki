const UiPrompt = require('./uiprompt.js');
const GameActions = require('../GameActions/GameActions');

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
            controller: 'self',
            gameAction: GameActions.attach({ attachment: this.attachmentCard }),
            onSelect: (player, card) => {
                GameActions.attach({ attachment: this.attachmentCard }).resolve(card, { game: this.game, player: this.player, source: card });
                return true;
            }
        });
    }
}

module.exports = AttachmentPrompt;
