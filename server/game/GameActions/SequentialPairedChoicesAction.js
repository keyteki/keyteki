const { EVENTS } = require('../Events/types');
const GameAction = require('./GameAction');
const CardSelector = require('../CardSelector');

/**
 * A game action that pairs cards from one group with cards from another group.
 * For each source card, prompts to select a target card based on the source's properties.
 * The specified action is performed on all targets simultaneously after all pairs are selected.
 *
 * Properties:
 * - sourceCondition: Function (card, context) => boolean - condition for source cards
 * - sourcePromptTitle: String - title for source selection prompt
 * - targetAction: Function (targets) => GameAction - factory function that creates the action to perform on all targets
 * - targetCondition: Function (card, sourceCard, context) => boolean - condition for targets based on source
 * - targetPromptTitle: String | Function(sourceCard) => String - title for target selection prompt
 * - pairMessage: String - message template for each pair, uses {0}=player, {1}=source, {2}=sourceCard, {3}=targetCard
 */
class SequentialPairedChoicesAction extends GameAction {
    setDefaultProperties() {
        this.pairMessage = null;
        this.sourceCondition = () => true;
        this.sourcePromptTitle = 'Choose a card';
        this.targetAction = null;
        this.targetCondition = () => true;
        this.targetPromptTitle = 'Choose a card';
    }

    setup() {
        super.setup();
        this.effectMsg = 'pair cards';
    }

    hasLegalTarget(context) {
        this.update(context);
        const sourceSelector = CardSelector.for({
            cardCondition: (card) => this.sourceCondition(card, context)
        });
        return sourceSelector.hasEnoughTargets(context);
    }

    canAffect() {
        return true;
    }

    getEventArray(context) {
        return [
            super.createEvent(EVENTS.unnamedEvent, {}, () => {
                // Track used sources and marked targets
                const usedSources = [];
                const markedTargets = [];

                // Build initial source selector to count sources
                const initialSourceSelector = CardSelector.for({
                    cardCondition: (card) => this.sourceCondition(card, context)
                });
                const sources = initialSourceSelector.getAllLegalTargets(context);

                // Queue prompts for each source
                for (let i = 0; i < sources.length; i++) {
                    context.game.queueSimpleStep(() => {
                        // Prompt for source selection
                        const sourceSelector = CardSelector.for({
                            cardCondition: (card) =>
                                this.sourceCondition(card, context) && !usedSources.includes(card)
                        });

                        if (!sourceSelector.hasEnoughTargets(context)) {
                            return;
                        }

                        context.game.promptForSelect(context.game.activePlayer, {
                            activePromptTitle: this.sourcePromptTitle,
                            context: context,
                            selector: sourceSelector,
                            onSelect: (player, sourceCard) => {
                                usedSources.push(sourceCard);

                                // Now prompt for target selection
                                const targetPromptTitle =
                                    typeof this.targetPromptTitle === 'function'
                                        ? this.targetPromptTitle(sourceCard)
                                        : this.targetPromptTitle;

                                const targetSelector = CardSelector.for({
                                    cardCondition: (card) =>
                                        this.targetCondition(card, sourceCard, context) &&
                                        !markedTargets.includes(card)
                                });

                                if (!targetSelector.hasEnoughTargets(context)) {
                                    // No valid targets for this source, continue
                                    return true;
                                }

                                context.game.promptForSelect(context.game.activePlayer, {
                                    activePromptTitle: targetPromptTitle,
                                    context: context,
                                    selector: targetSelector,
                                    onSelect: (player, targetCard) => {
                                        markedTargets.push(targetCard);
                                        if (this.pairMessage) {
                                            context.game.addMessage(
                                                this.pairMessage,
                                                player,
                                                context.source,
                                                sourceCard,
                                                targetCard
                                            );
                                        }
                                        return true;
                                    }
                                });

                                return true;
                            }
                        });
                    });
                }

                // After all selections, perform the action on all marked targets
                context.game.queueSimpleStep(() => {
                    if (markedTargets.length > 0 && this.targetAction) {
                        const action = this.targetAction(markedTargets);
                        action.update(context);
                        context.game.openEventWindow(action.getEventArray(context));
                    }
                });
            })
        ];
    }
}

module.exports = SequentialPairedChoicesAction;
