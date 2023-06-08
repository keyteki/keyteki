const CardListSelector = require('./CardListSelector');
const GameAction = require('./GameAction');

class SequentialCardLastingEffectAction extends GameAction {
    setDefaultProperties() {
        this.duration = 'untilEndOfRound';
        this.condition = null;
        this.until = null;
        this.effect = [];
        this.targetLocation = null;
    }

    setup() {
        super.setup();
        if (!Array.isArray(this.forEach)) {
            this.forEach = [this.forEach];
        }

        this.effectMsg = 'do several things';
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.forEach.length > 0;
    }

    canAffect() {
        return true;
    }

    queueActionSteps(context, element) {
        let action = context.game.actions.cardLastingEffect({
            duration: this.duration,
            condition: this.condition,
            until: this.until,
            effect: this.effect,
            targetLocation: this.targetLocation
        });

        context.game.queueSimpleStep(() => {
            action.setDefaultTarget(() => element);
            action.preEventHandler(context);
        });

        context.game.queueSimpleStep(() =>
            context.game.openEventWindow(action.getEventArray(context))
        );
    }

    filterAndApplyAction(context, forEach) {
        if (forEach.length > 1) {
            context.game.promptForSelect(context.game.activePlayer, {
                activePromptTitle: 'Choose a card',
                selector: new CardListSelector(forEach),
                source: context.source,
                onSelect: (player, card) => {
                    this.queueActionSteps(context, card);
                    context.game.queueSimpleStep(() => {
                        this.filterAndApplyAction(
                            context,
                            forEach.filter((c) => c !== card)
                        );
                    });
                    return true;
                }
            });
        } else if (forEach.length === 1) {
            this.queueActionSteps(context, forEach[0]);
        }
    }

    getEventArray(context) {
        return [
            super.createEvent('unnamedEvent', {}, () => {
                this.filterAndApplyAction(context, this.forEach);
            })
        ];
    }
}

module.exports = SequentialCardLastingEffectAction;
