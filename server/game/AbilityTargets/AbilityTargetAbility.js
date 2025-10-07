import CardSelector from '../CardSelector.js';
import AbilityTarget from './AbilityTarget.js';

class AbilityTargetAbility extends AbilityTarget {
    constructor(name, properties, ability) {
        super(name, properties, ability);
        this.selector = this.getSelector(properties);
    }

    getSelector(properties) {
        let cardCondition = (card, context) => {
            let abilities = card.abilities.actions
                .concat(card.abilities.reactions)
                .filter((ability) => ability.printedAbility);
            return abilities.some((ability) => {
                let contextCopy = context.copy();
                contextCopy.targetAbility = ability;
                if (context.stage === 'pretarget') {
                    return false;
                }

                return (
                    properties.cardCondition(card, contextCopy) &&
                    super.checkTarget(context) &&
                    properties.gameAction.some((gameAction) =>
                        gameAction.hasLegalTarget(contextCopy)
                    )
                );
            });
        };

        return CardSelector.for(
            Object.assign({}, properties, { cardCondition: cardCondition, targets: false })
        );
    }

    hasLegalTarget(context) {
        return this.selector.hasEnoughTargets(context) && super.hasLegalTarget(context);
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context);
    }

    resolve(context, targetResults) {
        if (
            targetResults.cancelled ||
            targetResults.payCostsFirst ||
            targetResults.delayTargeting
        ) {
            return;
        }

        let buttons = [];
        let waitingPromptTitle = '';
        if (context.stage === 'pretarget') {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if (context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }

        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            buttons: buttons,
            context: context,
            selector: this.selector,
            onSelect: (player, card) => {
                let ability =
                    card.abilities.actions.find((action) => action.printedAbility) ||
                    card.abilities.reactions.find((reaction) => reaction.printedAbility);
                context.targetAbility = ability;
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
            Object.assign(promptProperties, this.properties)
        );
    }

    checkTarget(context) {
        if (!context.targetAbility) {
            return false;
        }

        return (
            this.properties.cardType === context.targetAbility.card.type &&
            this.properties.cardCondition(context.targetAbility.card, context) &&
            super.checkTarget(context)
        );
    }
}

export default AbilityTargetAbility;
