const GameAction = require('./GameAction');

class AddEventToWindowAction extends GameAction {
    setDefaultProperties() {
        this.eventToAdd = null;
        this.targetWindow = null;
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.targetWindow && !!this.eventToAdd;
    }

    getEventArray() {
        return [super.createEvent('unnamedEvent', { targetWindow: this.targetWindow, eventToAdd: this.eventToAdd }, event => {
            event.targetWindow.addEvent(event.eventToAdd);
        })];
    }
}

module.exports = AddEventToWindowAction;
