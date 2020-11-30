const GameAction = require('./GameAction');

class SequentialPutIntoPlayAction extends GameAction {
    setDefaultProperties() {
        this.action = null;
        this.forEach = [];
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
        return (this.num > 0 || this.forEach.length > 0) && !!this.action;
    }

    canAffect() {
        return true;
    }

    queueActionSteps(context, element) {
        let action = this.action;
        if (typeof action === 'function') {
            action = action(element);
        }

        context.game.queueSimpleStep(() => {
            action.setDefaultTarget(() => element);
            action.preEventHandler(context);
        });
        context.game.queueSimpleStep(() =>
            context.game.openEventWindow(action.getEventArray(context))
        );
    }

    filterAndApplyAction(context, forEach) {
        let filteredForEach = forEach.filter(
            (card) => !card.gigantic || forEach.some((part) => part.id === card.compositeId)
        );

        if (filteredForEach.length > 0) {
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a creature to put into play',
                cardType: 'creature',
                controller: 'any',
                location: 'any',
                cardCondition: (card) => filteredForEach.includes(card),
                source: context.source,
                revealTargets: true,
                onSelect: (player, card) => {
                    this.queueActionSteps(context, card);
                    context.game.queueSimpleStep(() => {
                        this.filterAndApplyAction(
                            context,
                            filteredForEach.filter((c) => {
                                return c !== card && c !== card.composedPart;
                            })
                        );
                    });
                    return true;
                }
            });
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

module.exports = SequentialPutIntoPlayAction;
