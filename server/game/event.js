class Event {
    constructor() {
        this.cancel = false;
    }

    preventDefault() {
        this.cancel = true;
    }
}

module.exports = Event;
