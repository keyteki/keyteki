const _ = require('underscore');

class Event {
    constructor(name, params, handler) {
        this.name = name;
        this.cancelled = false;
        this.handler = handler;
        this.window = null;
        this.thenEvents = [];
        this.isSuccessful = () => false;
        this.parentEvent = null;

        _.extend(this, params);
        if(!this.order) {
            this.order = 0;
        }
    }

    cancel() {
        this.cancelled = true;
        this.window.removeEvent(this);
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
        if(this.cancelled) {
            return;
        }
        if(this.card && this.gameAction && !this.card.allowGameAction(this.gameAction, this.context)) {
            this.cancel();
        }
        if(this.condition && this.window && !this.condition(this.window.events)) {
            this.cancel();
        }
    }
    
    executeHandler() {
        this.isSuccessful = () => true;
        if(this.handler) {
            this.handler(this);
        }
    }

    replaceHandler(newHandler) {
        this.handler = newHandler;
    }
}

module.exports = Event;
