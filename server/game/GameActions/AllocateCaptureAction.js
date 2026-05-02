const GameAction = require('./GameAction');
const AllocateAmberPrompt = require('../gamesteps/AllocateAmberPrompt');
const CardSelector = require('../CardSelector.js');

class AllocateCaptureAction extends GameAction {
    setDefaultProperties() {
        this.cardCondition = () => true;
        this.amberStep = 1;
        this.numAmber = 0;
        this.numSteps = 0;
        this.controller = 'self';
        this.player = null;
        this.menuTitle = null;
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        this.events = [];
        const selector = this.getSelector();

        const numSteps = this.numSteps || this.numAmber;
        if (numSteps > 0 && this.amberStep > 0 && selector.getAllLegalTargets(context).length > 0) {
            context.game.queueStep(
                new AllocateAmberPrompt(context.game, {
                    amberStep: this.amberStep,
                    numSteps: numSteps,
                    selector: selector,
                    context: context,
                    menuTitle: this.menuTitle,
                    onSelect: (cardAmber) => {
                        for (const uuid of Object.keys(cardAmber)) {
                            const card = context.game.findAnyCardInPlayByUuid(uuid);
                            const amount = cardAmber[uuid];
                            if (card && amount > 0) {
                                const captureEvent = context.game.actions
                                    .capture({ amount: amount, player: this.player })
                                    .getEvent(card, context);
                                const captureHandler = captureEvent.handler;
                                captureEvent.replaceHandler((event) => {
                                    const amberBefore = event.card.amber;
                                    captureHandler(event);
                                    const amberCaptured = event.card.amber - amberBefore;
                                    if (amberCaptured > 0) {
                                        context.game.addMessage(
                                            '{0} uses {1} to have {2} capture {3} amber',
                                            context.player,
                                            context.source,
                                            event.card,
                                            amberCaptured
                                        );
                                    }
                                });

                                this.events.push(captureEvent);
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
        return (this.numSteps || this.numAmber) > 0 && this.getSelector().hasEnoughTargets(context);
    }

    getEventArray() {
        return this.events;
    }
}

module.exports = AllocateCaptureAction;
