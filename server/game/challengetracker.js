const _ = require('underscore');

class ChallengeTracker {
    constructor() {
        this.complete = 0;
        this.challengeTypes = {
            military: {
                performed: 0,
                max: 1,
                won: 0,
                lost: 0
            },
            intrigue: {
                performed: 0,
                max: 1,
                won: 0,
                lost: 0
            },
            power: {
                performed: 0,
                max: 1,
                won: 0,
                lost: 0
            }
        };
    }

    reset() {
        this.complete = 0;
        this.resetForType('military');
        this.resetForType('intrigue');
        this.resetForType('power');
    }

    resetForType(challengeType) {
        this.challengeTypes[challengeType].performed = 0;
        this.challengeTypes[challengeType].won = 0;
        this.challengeTypes[challengeType].lost = 0;
    }

    isAtMax(challengeType) {
        if(!_.isUndefined(this.maxTotal) && this.complete >= this.maxTotal) {
            return true;
        }

        return this.challengeTypes[challengeType].performed >= this.challengeTypes[challengeType].max;
    }

    getWon(challengeType) {
        return this.challengeTypes[challengeType].won;
    }

    getLost(challengeType) {
        return this.challengeTypes[challengeType].lost;
    }

    setMax(max) {
        this.maxTotal = max;
    }

    clearMax() {
        delete this.maxTotal;
    }

    perform(challengeType) {
        this.challengeTypes[challengeType].performed++;
        this.complete++;
    }

    won(challengeType) {
        this.challengeTypes[challengeType].won++;
    }

    lost(challengeType) {
        this.challengeTypes[challengeType].lost++;
    }

    modifyMaxForType(challengeType, number) {
        this.challengeTypes[challengeType].max += number;
    }
}

module.exports = ChallengeTracker;
