const _ = require('underscore');

class Event {
    constructor(name, params, merge = false) {
        this.name = name;
        this.cancelled = false;
        this.shouldSkipHandler = false;

        if(merge) {
            _.extend(this, params);
            this.params = [this].concat([params]);
        } else {
            this.params = [this].concat(params);
        }
    }

    cancel() {
        this.cancelled = true;
    }

    skipHandler() {
        this.shouldSkipHandler = true;
    }

    saveCard(card) {
        if(!this.cards) {
            return;
        }

        card.markAsSaved();
        this.cards = _.reject(this.cards, c => c === card);
        card.game.raiseEvent('onCardSaved', { card: card });

        if(_.isEmpty(this.cards)) {
            this.cancel();
        }
    }
}

module.exports = Event;
