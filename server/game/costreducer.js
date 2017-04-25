const _ = require('underscore');

class CostReducer {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.uses = 0;
        this.limit = properties.limit;
        this.match = properties.match;
        this.amount = properties.amount || 1;
        this.playingTypes = _.isArray(properties.playingTypes) ? properties.playingTypes : [properties.playingTypes];
        if(this.limit) {
            this.limit.registerEvents(game);
        }
    }

    canReduce(playingType, card) {
        if(this.limit && this.limit.isAtMax()) {
            return false;
        }

        return this.playingTypes.includes(playingType) && !!this.match(card);
    }

    getAmount(card) {
        if(_.isFunction(this.amount)) {
            return this.amount(card);
        }

        return this.amount;
    }

    markUsed() {
        if(this.limit) {
            this.limit.increment();
        }
    }

    isExpired() {
        return !!this.limit && this.limit.isAtMax() && !this.limit.isRepeatable();
    }

    unregisterEvents() {
        if(this.limit) {
            this.limit.unregisterEvents(this.game);
        }
    }
}

module.exports = CostReducer;
