const _ = require('underscore');
const uuid = require('uuid');

class Event {
    constructor(name, params, handler) {
        this.name = name;
        this.cancelled = false;
        this.handler = handler;
        this.window = null;
        this.thenEvents = [];
        this.parentEvent = null;
        this.result = { resolved: false, success: false};
        this.uuid = uuid.v1();

        _.extend(this, params);
        this.params = [this].concat(params);
        if(!this.order) {
            this.order = 0;
        }
    }

    cancel() {
        this.cancelled = true;
        this.resolved = false;
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
        if(this.condition && this.window && !this.condition(this.window.events)) {
            this.cancel();
        }
    }
    
    executeHandler() {
        if(this.handler) {
            this.result = this.handler(...this.params) || { resolved: true, success: true};
        }
    }

    replaceHandler(newHandler) {
        this.handler = newHandler;
    }
}

module.exports = Event;
