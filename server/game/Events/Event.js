const _ = require('underscore');

class Event {
    constructor(name, params = {}, handler, gameAction) {
        this.name = name;
        this.cancelled = false;
        this.resolved = false;
        this.handler = handler;
        this.gameAction = gameAction;
        this.card = null;
        this.context = null;
        this.condition = (event) => true; // eslint-disable-line no-unused-vars
        this.order = 0;
        this.parentEvent = null;
        this.childEvent = null;
        this.subEvent = null;
        this.openReactionWindow = true;

        _.extend(this, params);

        if (this.card) {
            this.clone = this.card.createSnapshot();
        }
    }

    cancel() {
        this.cancelled = true;
        this.resolved = false;
    }

    addChildEvent(event) {
        if (this.getSimultaneousEvents().includes(event)) {
            return;
        }

        if (event.childEvent) {
            this.addChildEvent(event.childEvent);
            event.childEvent = null;
        }

        if (this.childEvent) {
            this.childEvent.addChildEvent(event);
        } else {
            this.childEvent = event;
            event.parentEvent = this;
            if (event.subEvent) {
                this.addSubEvent(event.subEvent);
                event.subEvent = null;
            }
        }
    }

    getSimultaneousEvents() {
        let events = this.parentEvent
            ? this.parentEvent.getSimultaneousEvents()
            : this.getChildEvents();
        return events.filter((event) => !event.cancelled);
    }

    getChildEvents() {
        let events = [this];
        return this.childEvent ? events.concat(this.childEvent.getChildEvents()) : events;
    }

    addSubEvent(event) {
        if (this.subEvent && this.subEvent.getSimultaneousEvents().includes(event)) {
            return;
        }

        if (this.subEvent) {
            this.subEvent.addChildEvent(event);
        } else if (this.parentEvent) {
            this.parentEvent.addSubEvent(event);
        } else {
            this.subEvent = event;
            event.openReactionWindow = false;
        }
    }

    checkCondition() {
        if (this.childEvent) {
            this.childEvent.checkCondition();
        }

        if (this.resolved || this.cancelled) {
            return;
        }

        if (
            !this.condition(this) ||
            (this.gameAction && !this.gameAction.checkEventCondition(this))
        ) {
            this.cancel();
            return;
        }

        if (this.card) {
            this.clone = this.card.createSnapshot();
        }
    }

    executeHandler() {
        this.resolved = true;
        if (this.handler) {
            this.handler(this);
        }
    }

    replaceHandler(newHandler) {
        this.handler = newHandler;
    }
}

module.exports = Event;
