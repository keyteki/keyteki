class AbilityLimit {
    constructor(max, eventName) {
        this.max = max;
        this.eventName = eventName;
        this.useCount = 0;
        this.resetHandler = () => this.reset();
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

    registerEvents(eventEmitter) {
        eventEmitter.on(this.eventName, this.resetHandler);
    }

    unregisterEvents(eventEmitter) {
        eventEmitter.removeListener(this.eventName, this.resetHandler);
    }
}

AbilityLimit.perChallenge = function(max) {
    return new AbilityLimit(max, 'onChallengeFinished');
};

AbilityLimit.perPhase = function(max) {
    return new AbilityLimit(max, 'onPhaseEnded');
};

AbilityLimit.perRound = function(max) {
    return new AbilityLimit(max, 'onRoundEnded');
};

module.exports = AbilityLimit;
