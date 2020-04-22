const _ = require('underscore');

class Event {
    constructor(name, params = {}, handler) {
        this.name = name;
        this.cancelled = false;
        this.handler = handler;
        this.card = null;
        this.context = null;
        this.condition = (event) => true; // eslint-disable-line no-unused-vars
        this.onCancel = (event) => true;
        this.order = 0;
        this.parentEvent = null;
        this.childEvent = null;
        this.sharedReactionEvent = null;
        this.sharesReactionWindowWithEvent = null;
        this.nextEvent = null;
        //this.previousEvent = null;

        _.extend(this, params);
    }

    cancel() {
        this.cancelled = true;
    }

    addChildEvent(event) {
        if(this.getSimultaneousEvents().includes(event)) {
            return;
        }

        if(this.childEvent) {
            this.childEvent.addChildEvent(event);
        } else {
            event.parentEvent = this;
            this.childEvent = event;
            if(event.nextEvent) {
                this.addNextEvent(event.nextEvent);
                event.nextEvent = null;
            }
        }
    }

    getSimultaneousEvents() {
        return this.parentEvent ? this.parentEvent.getSimultaneousEvents() : this.getChildEvents();
    }

    getChildEvents() {
        let events = this.cancelled ? [] : [this];

        if(this.childEvent) {
            return events.concat(this.childEvent.getChildEvents());
        }

        return events;
    }

    addSharedReactionEvent(event) {
        if(this.getSharedReactionEvents().includes(event)) {
            return;
        }

        if(this.sharedReactionEvent) {
            this.sharedReactionEvent.addSharedReactionEvent(event);
        } else if(this.parentEvent) {
            this.parentEvent.addSharedReactionEvent(event);
        } else {
            this.sharedReactionEvent = event;
        }
    }

    getSharedReactionEvents() {
        let events = this.getChildEvents();
        if(this.sharedReactionEvent) {
            return events.concat(this.sharedReactionEvent.getSharedReactionEvents());
        }

        return events;
    }

    addNextEvent(event) {
        if(this.parentEvent) {
            this.parentEvent.addNextEvent(event);
        } else if(this.nextEvent) {
            this.nextEvent.addChildEvent(event);
        } else {
            this.nextEvent = event;
            //event.previousEvent = this;
        }
    }
    /*
    findFirstEvent(predicate = () => true) {
        if(this.previousEvent && this.previousEvent.findFirstEvent(predicate)) {
            return this.previousEvent.findFirstEvent(predicate);
        }

        return this.getChildEvents().find(predicate);
    } */

    sharesReactionWindowWith(event) {
        event.addSharedReactionEvent(this);
        this.sharesReactionWindowWithEvent = event;
    }

    checkCondition() {
        if(this.childEvent) {
            this.childEvent.checkCondition();
        }

        if(this.resolved || this.name === 'unnamedEvent' || this.cancelled) {
            return;
        }

        if(!this.condition(this)) {
            this.cancel();
            return;
        }

        if(this.card) {
            this.clone = this.card.createSnapshot();
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
