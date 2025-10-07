import GameAction from './GameAction.js';
import AllocateDamagePrompt from '../gamesteps/AllocateDamagePrompt.js';
import CardSelector from '../CardSelector.js';

class AllocateDamageAction extends GameAction {
    setDefaultProperties() {
        this.cardCondition = () => true;
        this.damageStep = 1;
        this.numSteps = 0;
        this.splash = 0;
        this.controller = 'any';
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        this.events = [];
        const selector = this.getSelector();

        if (
            this.numSteps > 0 &&
            this.damageStep > 0 &&
            selector.getAllLegalTargets(context).length > 0
        ) {
            context.game.queueStep(
                new AllocateDamagePrompt(context.game, {
                    damageStep: this.damageStep,
                    numSteps: this.numSteps,
                    splash: this.splash,
                    selector: selector,
                    context: context,
                    onSelect: (cardDamage) => {
                        for (const uuid of Object.keys(cardDamage)) {
                            const card = context.game.findAnyCardInPlayByUuid(uuid);
                            const amount =
                                (cardDamage[uuid].damage || 0) + (cardDamage[uuid].splash || 0);
                            if (card) {
                                this.events.push(
                                    context.game.actions
                                        .dealDamage({ amount: amount })
                                        .getEvent(card, context)
                                );
                            }
                        }
                    }
                })
            );
        }
    }

    getSelector() {
        return CardSelector.for({
            cardType: 'creature',
            cardCondition: this.cardCondition,
            controller: this.controller
        });
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.getSelector().hasEnoughTargets(context);
    }

    getEventArray() {
        return this.events;
    }
}

export default AllocateDamageAction;
