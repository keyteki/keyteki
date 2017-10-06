const _ = require('underscore');

class Event {
    constructor(name, params, handler = () => true) {
        this.name = name;
        this.cancelled = false;
        this.handler = handler;

        _.extend(this, params);
        this.params = [this].concat(params);
    }

    cancel() {
        this.cancelled = true;
    }
}

module.exports = Event;
