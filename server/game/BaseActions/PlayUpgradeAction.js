const BasePlayAction = require('./BasePlayAction');
const AttachAction = require('../GameActions/AttachAction');
const CardLastingEffectAction = require('../GameActions/CardLastingEffectAction');
const CardSelector = require('../CardSelector');
const Effects = require('../effects');

/**
 * Action for playing an upgrade card from hand.
 *
 * When playing from hand, this class handles target selection BEFORE opening the event window.
 * This allows the player to cancel (via Cancel button) without triggering any events or bonus icons.
 * The selected target is passed through via the preselectedTarget flag.
 *
 * For upgrades put into play by other effects (not from hand), the normal target resolution
 * handles selection (without a Cancel button).
 */
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
        this.preselectedTarget = null;
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
        if (this.preselectedTarget) {
            context.target = this.preselectedTarget;
            return {
                cancelled: false,
                payCostsFirst: false,
                delayTargeting: null
            };
        }
        // If early target selection is needed, skip normal resolveTargets -
        // executeHandler will handle the prompt instead
        if (this.needsEarlyTargetSelection(context)) {
            return {
                cancelled: false,
                payCostsFirst: false,
                delayTargeting: null
            };
        }
        return super.resolveTargets(context);
    }

    needsEarlyTargetSelection(context) {
        const card = context.source;
        const player = context.player;

        // Only need early target selection (with Cancel button) when:
        // 1. Playing from hand
        // 2. The player owns the card
        // 3. Not being played via a card effect (mustPlay is set for effect-triggered plays)
        // 4. No parent already specified
        if (card.location !== 'hand' || card.owner !== player || context.mustPlay || this.parent) {
            return false;
        }

        return true;
    }

    getValidTargets(context) {
        let cardTypes = ['creature'];
        if (context.source.anyEffect('canAttachToArtifacts')) {
            cardTypes = cardTypes.concat(['artifact']);
        }

        const selector = CardSelector.for({
            cardType: cardTypes,
            controller: 'self'
        });

        return selector.getAllLegalTargets(context);
    }

    promptForTargetSelection(context, callback) {
        const card = context.source;
        const player = context.player;
        const game = context.game;

        let title = 'Choose a creature to attach this upgrade to';
        let cardTypes = ['creature'];
        if (card.anyEffect('canAttachToArtifacts')) {
            title = 'Choose a card to attach this upgrade to';
            cardTypes = cardTypes.concat(['artifact']);
        }

        game.promptForSelect(player, {
            activePromptTitle: title,
            context: context,
            source: card,
            cardType: cardTypes,
            cardCondition: (targetCard) => card.canAttach(targetCard, context),
            buttons: [{ text: 'Cancel', type: 'cancel' }],
            onSelect: (p, selectedCard) => {
                this.preselectedTarget = selectedCard;
                context.target = selectedCard;
                callback();
                return true;
            },
            onCancel: () => {
                // Don't proceed with the play
                return true;
            }
        });
    }

    executeHandler(context) {
        if (this.needsEarlyTargetSelection(context)) {
            this.promptForTargetSelection(context, () => {
                super.executeHandler(context);
            });
        } else {
            super.executeHandler(context);
        }
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements) {
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

module.exports = PlayUpgradeAction;
