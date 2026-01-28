const BasePlayAction = require('./BasePlayAction');

class PlayCreatureAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this creature';
        this.deploy = false;
    }

    // displayMessage() {
    //     // Suppress the default play message - PutIntoPlayAction will show the appropriate message
    //     // based on whether the creature actually enters play or gets returned
    // }

    addSubEvent(event, context) {
        super.addSubEvent(event, context);
        let action = context.game.actions.putIntoPlay({
            myControl: true,
            deploy: this.deploy,
            beingPlayed: true
        });
        action.preEventHandler(context);
        event.putIntoPlayEvent = action.getEvent(context.source, context);
        event.addChildEvent(event.putIntoPlayEvent);
    }

    executeHandler(context) {
        if (context.source.giganticBottom && !context.source.composedPart) {
            let parts = context.source.controller
                .getSourceList(context.source.location)
                .filter((part) => context.source.compositeId === part.id);

            if (parts.length > 1) {
                // if there are two gigantic top parts, it could be relevant to choose among them
                // if they have different enhancements
                context.game.promptForSelect(context.game.activePlayer, {
                    source: context.source,
                    activePromptTitle: 'Choose a top part to play',
                    cardType: 'creature',
                    location: 'hand',
                    cardCondition: (card) => parts.includes(card),
                    onSelect: (p, part) => {
                        context.source.composedPart = part;
                        super.executeHandler(context);
                        return true;
                    }
                });
            } else {
                super.executeHandler(context);
            }
        } else {
            super.executeHandler(context);
        }
    }
}

module.exports = PlayCreatureAction;
