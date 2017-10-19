const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class TogashiKazue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play Togashi Kazue as an attachment',
            condition: () => {
                let clone = new TogashiKazue(this.owner, this.cardData);
                clone.type = 'attachment';
                return this.controller.fate >= this.controller.getReducedCost('play', clone);
            },
            location: 'hand',
            printedAbility: false,
            cannotBeCopied: true,
            handler: () => {
                this.type = 'attachment';
                let context = {
                    game: this.game,
                    player: this.controller,
                    source: this
                };
                this.game.resolveAbility(new PlayAttachmentAction(), context);
                this.game.markActionAsTaken(); // both this ability and resolving the action ability above mark the action as taken, so give priority to the other player
            }
        });
    }

    leavesPlay() {
        this.type = 'character';
        super.leavesPlay();
    }
}

TogashiKazue.id = 'togashi-kazue';

module.exports = TogashiKazue;
