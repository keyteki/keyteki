const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class PlayTattooedWandererAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card);
        this.title = 'Play Tattooed Wanderer as an attachment';
    }

    canResolveTargets(context) {
        context.source.type = 'attachment';
        let result = super.canResolveTargets(context);
        context.source.type = 'character';
        return result;
    }

    resolveTargets(context) {
        context.source.type = 'attachment';
        return super.resolveTargets(context);
    }
}

class TattooedWanderer extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTattooedWandererAsAttachment(this));
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
