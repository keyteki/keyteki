const _ = require('underscore');

class Event {
    constructor(name, params, handler, gameAction) {
        this.name = name;
        this.cancelled = false;
        this.resolved = false;
        this.handler = handler;
        this.gameAction = gameAction;
        this.context = null;
        this.window = null;
        this.getResult = () => {
            return { resolved: this.resolved, cancelled: this.cancelled };
        };
        this.condition = (event) => true; // eslint-disable-line no-unused-vars
        this.order = 0;
        this.isContingent = false;

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
        if(this.gameAction && !this.gameAction.checkEventCondition(this)) {
            this.cancel();
            return;
        }
        // TODO: do we need to check conditions on anything anymore?
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
}

module.exports = Event;
