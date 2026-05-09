const BasePlayAction = require('./BasePlayAction');

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this artifact';
    }

    displayMessage() {
        // Suppress the default play message - PutIntoPlayAction will show the appropriate message
        // based on whether the artifact enters play or gets returned
    }

    addSubEvent(event, context) {
        super.addSubEvent(event, context);
        event.addChildEvent(
            context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context)
        );
    }
}

module.exports = PlayAction;
