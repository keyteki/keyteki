const _ = require('underscore');

/**
 * Simplifies event registration given an event emitter to listen to events and
 * a context object to bind handlers on.
 */
class EventRegistrar {
    constructor(game, context) {
        this.game = game;
        this.context = context;
        this.events = [];
    }

    /**
     * Registers a series of event handlers by name on the context object. Takes
     * an array representing the events to be registered. If an array element is
     * a string, then it will listen to that event using a handler method of the
     * same name on the context object. If the array element is an object, the
     * keys of the object will be used as the events to listen on and the string
     * values will be used as the method names on the context object.
     *
     * @example
     * // Listen to event 'eventName' and bind context.eventName as the handler.
     * this.register(['eventName']);
     * // Listen to event 'eventName' and bind context.methodName as the handler.
     * this.register([{ eventName: 'methodName' }]);
     *
     * @param {Array} events - A list containing a mix of event names and
     * event-to-method mappings.
     */
    register(events) {
        _.each(events, event => {
            if(_.isString(event)) {
                this.registerEvent(event);
            } else {
                _.each(event, (methodName, eventName) => {
                    this.registerEvent(eventName, methodName);
                });
            }
        });
    }

    /**
     * Registers a single event handler.
     *
     * @param {string} eventName - the name of the event to be listened on.
     * @param {string} methodName An optional  name of the method to bind as a
     * handler. If not provided, the event name will be used as the method name.
     */
    registerEvent(eventName, methodName) {
        let method = this.context[methodName || eventName];

        if(!method) {
            throw new Error(`Cannot bind event handler for ${eventName}`);
        }
        console.log('registering', eventName, methodName)
        let boundHandler = method.bind(this.context);
        this.game.on(eventName, boundHandler);
        this.events.push({ name: eventName, handler: boundHandler });
    }

    /**
     * Unbinds all registered handlers from the event emitter.
     */
    unregisterAll() {
        _.each(this.events, event => {
            this.game.removeListener(event.name, event.handler);
        });
        this.events = [];
    }
}

module.exports = EventRegistrar;
