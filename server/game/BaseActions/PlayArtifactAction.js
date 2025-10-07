import BasePlayAction from './BasePlayAction.js';

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this artifact';
    }

    addSubEvent(event, context) {
        super.addSubEvent(event, context);
        event.addChildEvent(
            context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context)
        );
    }
}

export default PlayAction;
