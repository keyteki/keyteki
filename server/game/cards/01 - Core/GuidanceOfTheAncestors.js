const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class GuidanceOfTheAncestors extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: () => this.controller.fate >= this.controller.getReducedCost('play', this),
            location: 'conflict discard pile',
            handler: () => {
                let context = {
                    game: this.game,
                    player: this.controller,
                    source: this,
                    ability: new PlayAttachmentAction()
                };
                this.game.resolveAbility(context);
                this.game.markActionAsTaken();
            }
        });
    }
}

GuidanceOfTheAncestors.id = 'guidance-of-the-ancestors';

module.exports = GuidanceOfTheAncestors;
