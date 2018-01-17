const _ = require('underscore');
const uuid = require('uuid');

class Event {
    constructor(name, params, handler) {
        this.name = name;
        this.cancelled = false;
        this.handler = handler;
        this.window = null;
        this.thenEvents = [];
        this.success = false;
        this.parentEvent = null;
        this.uuid = uuid.v1();

        _.extend(this, params);
        this.params = [this].concat(params);
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

    preResolutionEffect() {
        return;
    }
    
    checkCondition() {
        if(this.condition && this.window && !this.condition(this.window.events)) {
            this.cancel();
        }
    }
    
    executeHandler() {
        this.success = true;
        if(this.handler) {
            this.handler(...this.params);
        }
    }

    replaceHandler(newHandler) {
        this.handler = newHandler;
    }
}

module.exports = Event;
