import BasePlayAction from './BasePlayAction.js';
import AttachAction from '../GameActions/AttachAction.js';
import CardLastingEffectAction from '../GameActions/CardLastingEffectAction.js';
import Effects from '../effects.js';

class PlayUpgradeAction extends BasePlayAction {
    constructor(card, parent) {
        let title = 'Choose a creature to attach this upgrade to';
        let cardType = 'creature';
        if (card.anyEffect('canAttachToArtifacts')) {
            title = 'Choose a card to attached this upgrade to';
            cardType = [cardType].concat(['artifact']);
        }
        super(card, {
            activePromptTitle: title,
            cardType: cardType,
            gameAction: new AttachAction((context) => ({ upgrade: context.source }))
        });
        this.title = 'Play this upgrade';
        this.parent = parent;
    }

    // Create a new copy of this action with a forced parent, since we can't
    // use the constructor directly in a GameAction without causing a
    // dependency cycle.
    newWithParent(parent) {
        return new PlayUpgradeAction(this.card, parent);
    }

    displayMessage(context) {
        if (context.target) {
            context.game.addMessage(
                '{0} plays {1} attaching it to {2}',
                context.player,
                context.source,
                context.target
            );
        } else {
            context.game.addMessage(
                '{0} plays {1} and it is discarded',
                context.player,
                context.source
            );
        }
    }

    resolveTargets(context) {
        if (this.parent) {
            context.target = this.parent;
            return {
                cancelled: false,
                payCostsFirst: false,
                delayTargeting: null
            };
        }
        return super.resolveTargets(context);
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (context.source.printedType === 'creature' && context.source.canPlayAsUpgrade()) {
            context.source.printedType = 'upgrade';
            let result = super.meetsRequirements(context, ignoredRequirements);
            context.source.printedType = 'creature';
            return result;
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    addSubEvent(event, context) {
        super.addSubEvent(event, context);
        let attachTargetType = ['creature'];
        if (context.source.anyEffect('canAttachToArtifacts')) {
            attachTargetType = attachTargetType.concat(['artifact']);
        }
        event.addChildEvent(
            new AttachAction({
                upgrade: context.source,
                targetType: attachTargetType
            }).getEvent(context.target, context)
        );
        if (context.source.type === 'creature') {
            const changeTypeEvent = new CardLastingEffectAction({
                duration: 'lastingEffect',
                effect: Effects.changeType('upgrade')
            }).getEvent(context.source, context);
            changeTypeEvent.gameAction = null;
            event.addChildEvent(changeTypeEvent);
        }
    }
}

export default PlayUpgradeAction;
