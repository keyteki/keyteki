class FixedAbilityLimit {
    constructor(max) {
        this.max = max;
        this.useCount = 0;
    }

    isRepeatable() {
        return false;
    }

    isAtMax() {
        return this.useCount >= this.max;
    }

    increment() {
        this.useCount += 1;
    }

    reset() {
        this.useCount = 0;
    }

    registerEvents() {
        // No event handling
    }

    unregisterEvents() {
        // No event handling
    }
}

class RepeatableAbilityLimit extends FixedAbilityLimit {
    constructor(max, eventName) {
        super(max);

        this.eventName = eventName;
        this.resetHandler = () => this.reset();
    }

    isRepeatable() {
        return true;
    }

    registerEvents(eventEmitter) {
        eventEmitter.on(this.eventName, this.resetHandler);
    }

    unregisterEvents(eventEmitter) {
        eventEmitter.removeListener(this.eventName, this.resetHandler);
    }
}

var AbilityLimit = {};

AbilityLimit.fixed = function(max) {
    return new FixedAbilityLimit(max);
};

AbilityLimit.repeatable = function(max, eventName) {
    return new RepeatableAbilityLimit(max, eventName);
};

AbilityLimit.perConflict = function(max) {
    return new RepeatableAbilityLimit(max, 'onConflictFinished');
};

AbilityLimit.perPhase = function(max) {
    return new RepeatableAbilityLimit(max, 'onPhaseEnded');
};

AbilityLimit.perRound = function(max) {
    return new RepeatableAbilityLimit(max, 'onRoundEnded');
};

module.exports = AbilityLimit;
