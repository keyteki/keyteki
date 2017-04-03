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
            },
            defender: {
                performed: 0,
                won: 0,
                lost: 0
            },
            attacker: {
                performed: 0,
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
        this.resetForType('defender');
        this.resetForType('attacker');
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

        if(this.challengeTypes[challengeType].cannotInitiate) {
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

    getPerformed(challengeType) {
        return this.challengeTypes[challengeType].performed;
    }

    setMax(max) {
        this.maxTotal = max;
    }

    clearMax() {
        delete this.maxTotal;
    }

    setCannotInitiateForType(challengeType, value) {
        this.challengeTypes[challengeType].cannotInitiate = value;
    }

    perform(challengeType) {
        this.challengeTypes[challengeType].performed++;
        this.complete++;
    }

    won(challengeType, wasAttacker) {
        this.challengeTypes[challengeType].won++;
        this.challengeTypes[wasAttacker ? 'attacker' : 'defender'].won++;
    }

    lost(challengeType, wasAttacker) {
        this.challengeTypes[challengeType].lost++;
        this.challengeTypes[wasAttacker ? 'attacker' : 'defender'].lost++;
    }

    modifyMaxForType(challengeType, number) {
        this.challengeTypes[challengeType].max += number;
    }
}

module.exports = ChallengeTracker;
