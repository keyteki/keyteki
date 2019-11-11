const _ = require('underscore');

class Event {
    constructor(name, params, handler, gameAction) {
        this.name = name;
        this.cancelled = false;
        this.resolved = false;
        this.handler = handler;
        this.gameAction = gameAction;
        this.card = null;
        this.context = null;
        this.window = null;
        this.condition = (event) => true; // eslint-disable-line no-unused-vars
        this.order = 0;
        this.isContingent = false;
        this.subEvents = [];
        this.isFullyResolved = event => {
            return event.resolved;
        };

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

    addSubEvent(event) {
        this.subEvents = this.subEvents.concat(event);
    }

    preResolutionEffect(game) {
        game.emit(this.name + ':preResolution', this);
    }

    checkCondition() {
        if(this.resolved || this.name === 'unnamedEvent') {
            return true;
        }

        if(this.cancelled || this.gameAction && !this.gameAction.checkEventCondition(this) || !this.condition(this)) {
            return false;
        }

        if(this.card) {
            this.clone = this.card.createSnapshot();
        }

        return true;
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
