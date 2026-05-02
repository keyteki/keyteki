const GameAction = require('./GameAction');
const AllocateAmberPrompt = require('../gamesteps/AllocateAmberPrompt');
const CardSelector = require('../CardSelector.js');

class AllocateCaptureAction extends GameAction {
    setDefaultProperties() {
        this.cardCondition = () => true;
        this.numAmber = 0;
        this.controller = 'self';
        this.player = null;
        this.menuTitle = null;
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        this.events = [];
        const selector = this.getSelector();

        if (this.numAmber > 0 && selector.getAllLegalTargets(context).length > 0) {
            context.game.queueStep(
                new AllocateAmberPrompt(context.game, {
                    numAmber: this.numAmber,
                    selector: selector,
                    context: context,
                    menuTitle: this.menuTitle,
                    onSelect: (cardAmber) => {
                        for (const uuid of Object.keys(cardAmber)) {
                            const card = context.game.findAnyCardInPlayByUuid(uuid);
                            const amount = cardAmber[uuid];
                            if (card && amount > 0) {
                                this.events.push(
                                    context.game.actions
                                        .capture({ amount: amount, player: this.player })
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
        return this.numAmber > 0 && this.getSelector().hasEnoughTargets(context);
    }

    getEventArray() {
        return this.events;
    }
}

module.exports = AllocateCaptureAction;
