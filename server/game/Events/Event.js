const _ = require('underscore');

class Event {
    constructor(name, params, handler) {
        this.name = name;
        this.cancelled = false;
        this.success = false;
        this.handler = handler;
        this.window = null;
        this.thenEvents = [];
        this.isSuccessful = () => this.success;
        this.condition = () => true;
        this.parentEvent = null;
        this.order = 0;

        _.extend(this, params);
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
        if(this.cancelled || this.success) {
            return;
        }
        if(this.card && this.gameAction && !this.card.allowGameAction(this.gameAction, this.context)) {
            this.cancel();
        }
        if(!this.condition()) {
            this.cancel();
        }
    }
    
    executeHandler() {
        this.success = true;
        if(this.handler) {
            this.handler(this);
        }
    }

    replaceHandler(newHandler) {
        this.handler = newHandler;
    }
}

module.exports = Event;
