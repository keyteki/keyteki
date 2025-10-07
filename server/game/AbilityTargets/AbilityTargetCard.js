import _ from 'underscore';

import CardSelector from '../CardSelector.js';
import AbilityTarget from './AbilityTarget.js';
import Optional from '../optional.js';

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
        return this.selector.hasEnoughTargets(context) && super.hasLegalTarget(context);
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context);
    }

    resolve(context, targetResults) {
        if (targetResults.cancelled || targetResults.payCostsFirst) {
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

export default AbilityTargetCard;
