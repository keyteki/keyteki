const CardListSelector = require('./CardListSelector');
const GameAction = require('./GameAction');

class SequentialPlayAction extends GameAction {
    setDefaultProperties() {
        this.revealList = [];
        this.ready = false;
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
        return this.forEach.length > 0;
    }

    canAffect() {
        return true;
    }

    queueActionSteps(context, element) {
        let action = context.game.actions.playCard();

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

        if (filteredForEach.length > 1) {
            context.game.promptForSelect(context.game.activePlayer, {
                activePromptTitle: 'Choose a card to play',
                selector: new CardListSelector(filteredForEach, this.revealList),
                source: context.source,
                revealTargets: this.revealList.length > 0,
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
        } else if (filteredForEach.length === 1) {
            this.queueActionSteps(context, filteredForEach[0]);
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

module.exports = SequentialPlayAction;
