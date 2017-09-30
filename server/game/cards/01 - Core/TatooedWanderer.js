const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class TattooedWanderer extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play Tattooed Wanderer as an attachment',
            condition: () => {
                let clone = new TattooedWanderer(this.owner, this.cardData);
                clone.type = 'attachment';
                return this.controller.fate >= this.controller.getReducedCost('play', clone);
            },
            location: 'hand',
            handler: () => {
                this.type = 'attachment';
                let context = {
                    game: this.game,
                    player: this.controller,
                    source: this
                };
                this.game.resolveAbility(new PlayAttachmentAction(), context);
            }
        });

        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }
    
    leavesPlay() {
        this.type = 'character';
        super.leavesPlay();
    }
}

TattooedWanderer.id = 'tattooed-wanderer';

module.exports = TattooedWanderer;
