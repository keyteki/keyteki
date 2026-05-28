const _ = require('underscore');

const CardSelector = require('../CardSelector.js');
const SingleCardSelector = require('../CardSelectors/SingleCardSelector.js');
const AbilityTarget = require('./AbilityTarget.js');
const Optional = require('../optional.js');
const { EVENTS } = require('../Events/types');

class AbilityTargetCard extends AbilityTarget {
    constructor(name, properties, ability) {
        super(name, properties, ability);
        for (let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget((context) => context.targets[name]);
        }

        this.selector = this.getSelector(properties);
    }

    getSelector(properties) {
        let cardCondition = (card, context) => {
            let contextCopy = context.copy();
            contextCopy.targets[this.name] = this.selector.formatSelectParam([card]);
            if (this.name === 'target') {
                contextCopy.target = contextCopy.targets[this.name];
            }

            this.resetGameActions();
            return (
                (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                (properties.gameAction.length === 0 ||
                    properties.gameAction.some((gameAction) =>
                        gameAction.hasLegalTarget(contextCopy)
                    ))
            );
        };

        return CardSelector.for(
            Object.assign({}, properties, { cardCondition: cardCondition, targets: true })
        );
    }

    hasLegalTarget(context) {
        if (
            this.properties.revealTargets &&
            Optional.EvalOptional(context, this.properties.optional) &&
            this.selector.findPossibleCards(context).length > 0
        ) {
            return super.hasLegalTarget(context);
        }

        return this.selector.hasEnoughTargets(context) && super.hasLegalTarget(context);
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context);
    }

    resolve(context, targetResults) {
        if (targetResults.cancelled || targetResults.payCostsFirst) {
            return;
        }

        // Detect infinite-loop scenarios up front so we can skip auto-resolve
        // and surface the 'Move to discard' escape button on the prompt below.
        // Each game action class may opt in by exposing a static
        // `isInfiniteLoop(context, legalTargets)` predicate (see
        // `GainsTextBoxAction`).
        const actionClasses = (this.properties.gameAction || [])
            .map((action) => action && action.constructor)
            .filter((cls) => cls && typeof cls.isInfiniteLoop === 'function');
        const legalTargets = this.selector.getAllLegalTargets(context);
        const infiniteLoopActive =
            actionClasses.length > 0 &&
            actionClasses.some((cls) => cls.isInfiniteLoop(context, legalTargets));

        // Auto-resolve when this is a non-optional, non-pretarget single-card target
        // and there is exactly one legal target. This skips a redundant prompt where
        // the player has no real choice. Players who prefer to click through every
        // forced choice can opt out via the `orderForcedAbilities` setting.
        // Skip auto-resolve when an infinite loop is active so the player gets
        // the prompt with the 'Move to discard' escape button.
        // TODO: Remove the orderForcedAbilities setting, which requires updating many tests that expect additional prompts.
        if (
            context.stage !== 'pretarget' &&
            !Optional.EvalOptional(context, this.properties.optional) &&
            !infiniteLoopActive &&
            this.selector instanceof SingleCardSelector &&
            legalTargets.length === 1 &&
            !context.player?.optionSettings?.orderForcedAbilities
        ) {
            const card = this.selector.formatSelectParam(legalTargets);
            context.targets[this.name] = card;
            if (this.name === 'target') {
                context.target = card;
            }

            return;
        }

        let otherProperties = _.omit(this.properties, 'cardCondition', 'player');

        let buttons = [];
        let waitingPromptTitle = '';
        if (context.stage === 'pretarget') {
            if (!targetResults.noCostsFirstButton) {
                buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            }

            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if (context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }

        // The prompt may offer an escape to discard the ability's source so
        // the player can break out of a detected infinite loop. `infiniteLoopActive`
        // and `actionClasses` were computed above so the auto-resolve branch
        // could honor the same escape.
        if (infiniteLoopActive) {
            buttons.unshift({
                text: `Move to discard`,
                arg: 'discardSelf'
            });
        }

        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            selector: this.selector,
            buttons: buttons,
            onSelect: (player, card) => {
                context.targets[this.name] = card;
                if (this.name === 'target') {
                    context.target = card;
                }

                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if (arg === 'costsFirst') {
                    targetResults.costsFirst = true;
                    return true;
                }

                if (arg === 'discardSelf' && infiniteLoopActive) {
                    context.game.addMessage(
                        '{0} resolves the infinite loop by moving {1} to the discard pile',
                        player,
                        context.source
                    );
                    context.game.raiseEvent(
                        EVENTS.onCardLeavesPlay,
                        { card: context.source, context: context },
                        () => context.source.owner.moveCard(context.source, 'discard')
                    );
                    targetResults.cancelled = true;
                    return true;
                }

                return true;
            }
        };
        context.game.promptForSelect(
            context.game.activePlayer,
            Object.assign(promptProperties, otherProperties)
        );
    }

    checkTarget(context) {
        if (Optional.EvalOptional(context, this.properties.optional)) {
            return super.checkTarget(context);
        } else if (!context.targets[this.name]) {
            return false;
        }

        let cards = context.targets[this.name];
        if (!Array.isArray(cards)) {
            cards = [cards];
        }

        return (
            cards.every((card) => this.selector.canTarget(card, context)) &&
            this.selector.hasEnoughSelected(cards, context) &&
            !this.selector.hasExceededLimit(cards) &&
            super.checkTarget(context)
        );
    }
}

module.exports = AbilityTargetCard;
