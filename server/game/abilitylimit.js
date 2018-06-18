class FixedAbilityLimit {
    constructor(max) {
        this.max = max;
        this.card = null;
        this.useCount = {};
    }

    isRepeatable() {
        return false;
    }

    getModifiedMax() {
        return this.card ? this.card.getModifiedLimitMax(this.max) : this.max;
    }

    isAtMax(player) {
        return !!this.useCount[player.name] && this.useCount[player.name] >= this.getModifiedMax();
    }

    increment(player) {
        if(this.useCount[player.name]) {
            this.useCount[player.name] += 1;
        } else {
            this.useCount[player.name] = 1;
        }
    }

    reset() {
        this.useCount = {};
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

AbilityLimit.unlimitedPerConflict = function() {
    return new RepeatableAbilityLimit(Infinity, 'onConflictFinished');
};

module.exports = AbilityLimit;
