const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class PlayTattooedWandererAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card);
        this.title = 'Play Tattooed Wanderer as an attachment';
    }

    executeHandler(context) {
        context.source.type = 'attachment';
        super.executeHandler(context);
    }
}

class TattooedWanderer extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTattooedWandererAsAttachment(this));
        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }

    // Remove the check on being an attachment when checking whether this can be played as one
    canAttach(card) {
        return card && card.getType() === 'character';
    }

    leavesPlay() {
        this.type = 'character';
        super.leavesPlay();
    }
}

TattooedWanderer.id = 'tattooed-wanderer';

module.exports = TattooedWanderer;
