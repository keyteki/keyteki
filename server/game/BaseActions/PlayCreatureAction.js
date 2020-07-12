const BasePlayAction = require('./BasePlayAction');

class PlayCreatureAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this creature';
    }

    addSubEvent(event, context) {
        let action = context.game.actions.putIntoPlay({ myControl: true });
        action.preEventHandler(context);
        event.addChildEvent(action.getEvent(context.source, context));
    }
}

module.exports = PlayCreatureAction;
