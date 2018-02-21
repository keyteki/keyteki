const _ = require('underscore');

class Event {
    constructor(name, params, handler) {
        this.name = name;
        this.cancelled = false;
        this.resolved = false;
        this.handler = handler;
        this.window = null;
        this.thenEvents = [];
        this.getOutcome = () => ({ resolved: this.resolved, cancelled: this.cancelled });
        this.condition = () => true;
        this.parentEvent = null;
        this.order = 0;

        _.extend(this, params);
    }

    cancel() {
        this.cancelled = true;
        if(this.window) {
            this.window.removeEvent(this);
        }
    }
    
    setWindow(window) {
        this.window = window;
    }

    unsetWindow() {
        this.window = null;
    }

    createContingentEvents() {
        return [];
    }

    preResolutionEffect() {
        return;
    }
    
    checkCondition() {
        if(this.cancelled || this.resolved) {
            return;
        }
        if(this.card && this.gameAction && !this.card.allowGameAction(this.gameAction, this.context)) {
            this.cancel();
            return;
        }
        if(!this.condition(this)) {
            this.cancel();
        }
    }
    
    executeHandler() {
        this.resolved = true;
        if(this.handler) {
            this.handler(this);
        }
    }

    replaceHandler(newHandler) {
        this.handler = newHandler;
    }

    addThenEvent(event) {
        this.thenEvents.push(event);
        event.parentEvent = this;
    }

    addThenGameAction(context, actions) {
        let events = [];
        _.each(actions, (cards, action) => {
            events = events.concat(context.game.getEventsForGameAction(action, cards, context));
        });
        _.each(events, event => event.parentEvent = this);
        this.thenEvents = this.thenEvents.concat(events);
        return events;
    }

    cancelThenEvents() {
        _.each(this.thenEvents, event => event.cancel());
    }
}

module.exports = Event;
