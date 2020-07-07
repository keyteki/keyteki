const BasePlayAction = require('./BasePlayAction');

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this artifact';
    }

    addSubEvent(event, context) {
        event.addChildEvent(
            context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context)
        );
    }
}

module.exports = PlayAction;
