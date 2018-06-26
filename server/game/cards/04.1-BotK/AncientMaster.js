const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class PlayAncientMasterAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card);
        this.title = 'Play Ancient Master as an attachment';
    }

    executeHandler(context) {
        context.source.type = 'attachment';
        super.executeHandler(context);
    }
}

class AncientMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayAncientMasterAsAttachment(this));
        this.reaction({
            title: 'Search top 5 card for kiho or tattoo',
            when: {
                onConflictDeclared: (event, context) => context.source.type === 'attachment' && context.source.parent.isAttacking(),
                onDefendersDeclared: (event, context) => context.source.type === 'attachment' && context.source.parent.isDefending()
            },
            printedAbility: false,
            effect: 'look at the top five cards of their deck',
            gameAction: ability.actions.deckSearch({
                amount: 5,
                cardCondition: card => card.hasTrait('kiho') || card.hasTrait('tattoo')
            })
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

AncientMaster.id = 'ancient-master';

module.exports = AncientMaster;
