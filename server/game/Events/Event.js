const _ = require('underscore');
const uuid = require('uuid');

class Event {
    constructor(name, params, handler) {
        this.name = name;
        this.cancelled = false;
        this.handler = handler;
        this.window = null;
        this.uuid = uuid.v1();
        this.order = 0;

        _.extend(this, params);
        this.params = [this].concat(params);
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
    
    checkCondition() {
        if(this.condition && this.window && !this.condition(this.window.events)) {
            this.cancel();
        }
    }
    
    executeHandler() {
        if(this.handler) {
            this.resolved = this.handler(...this.params);
        }
    }
}

module.exports = Event;
