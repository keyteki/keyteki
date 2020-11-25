const BasePlayAction = require('./BasePlayAction');

class PlayCreatureAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this creature';
    }

    executeHandler(context) {
        let card = context.source;
        if (card.giganticBottom && card.location === 'hand') {
            let parts = card.controller
                .getSourceList(card.location)
                .filter((part) => card.compositeId === part.id);

            if (parts.length > 1) {
                // there are two gigantic top parts and it could be relevant to choose among them
                // if they have different enhancements

                context.game.promptForSelect(context.player, {
                    source: card,
                    activePromptTitle: 'Select a top part to play',
                    cardType: 'creature',
                    location: 'hand',
                    cardCondition: (card) => parts.includes(card),
                    onSelect: (p, part) => {
                        card.composedPart = part;
                        return true;
                    }
                });
            }
        }

        super.executeHandler(context);
    }

    addSubEvent(event, context) {
        let action = context.game.actions.putIntoPlay({ myControl: true });
        action.preEventHandler(context);
        event.addChildEvent(action.getEvent(context.source, context));
    }
}

module.exports = PlayCreatureAction;
