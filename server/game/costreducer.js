const _ = require('underscore');

class CostReducer {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.uses = 0;
        this.limit = properties.limit;
        this.match = properties.match;
        this.targetCondition = properties.targetCondition;
        this.amount = properties.amount || 1;
        this.playingTypes = properties.playingTypes
            ? _.isArray(properties.playingTypes)
                ? properties.playingTypes
                : [properties.playingTypes]
            : ['play'];
        if (this.limit) {
            this.limit.registerEvents(game);
        }
    }

    canReduce(playingType, card, target = null) {
        if (this.limit && this.limit.isAtMax(this.source.controller)) {
            return false;
        }

        return (
            this.playingTypes.includes(playingType) &&
            !!this.match(card) &&
            this.checkTargetCondition(target)
        );
    }

    checkTargetCondition(target) {
        if (!this.targetCondition) {
            return true;
        }

        if (!target) {
            return false;
        }

        return this.targetCondition(target);
    }

    getAmount(card) {
        if (_.isFunction(this.amount)) {
            return this.amount(card);
        }

        return this.amount;
    }

    markUsed() {
        if (this.limit) {
            this.limit.increment(this.source.controller);
        }
    }

    isExpired() {
        return (
            !!this.limit && this.limit.isAtMax(this.source.controller) && !this.limit.isRepeatable()
        );
    }

    unregisterEvents() {
        if (this.limit) {
            this.limit.unregisterEvents(this.game);
        }
    }
}

module.exports = CostReducer;
