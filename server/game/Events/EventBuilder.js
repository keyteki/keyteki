const Event = require('./Event');
const InitiateCardAbilityEvent = require('./InitiateCardAbilityEvent');
const LeavesPlayEvent = require('./LeavesPlayEvent');
const RemoveFateEvent = require('./RemoveFateEvent');

const NameToEvent = {
    default: (name, params, handler) => new Event(name, params, handler),
    onCardAbilityInitiated: (name, params, handler) => new InitiateCardAbilityEvent(params),
    onCardLeavesPlay: (name, params) => new LeavesPlayEvent(params),
    onCardRemoveFate: (name, params) => new RemoveFateEvent(params)
};

class EventBuilder {
    static for(name, params, handler) {
        let factory = NameToEvent.default;
        if(NameToEvent[name]) {
            factory = NameToEvent[name];
        }

        return factory(name, params, handler);
    }
}

module.exports = EventBuilder;
