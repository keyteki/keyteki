const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class PlayTogashiKazueAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card);
        this.title = 'Play Togashi Kazue as an attachment';
    }

    executeHandler(context) {
        context.source.type = 'attachment';
        super.executeHandler(context);
    }
}

class TogashiKazue extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTogashiKazueAsAttachment(this));
        this.action({
            title: 'Steal a fate',
            condition: context => context.source.type === 'attachment' && context.source.parent.isParticipating(),
            printedAbility: false,
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card !== context.source.parent,
                gameAction: ability.actions.removeFate(context => ({ recipient: context.source.parent }))
            },
            effect: 'steal a fate from {0} and place it on {1}',
            effectArgs: context => context.source.parent
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

TogashiKazue.id = 'togashi-kazue';

module.exports = TogashiKazue;
