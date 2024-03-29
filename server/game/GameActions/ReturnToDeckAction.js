const CardGameAction = require('./CardGameAction');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.bottom = false;
        this.shuffle = false;
        this.shuffleDiscardIntoDeck = false;
    }

    setup() {
        super.setup();
        this.name = 'returnToDeck';
        if (this.shuffle) {
            this.effectMsg = "return {0} to their owner's deck";
        } else {
            this.effectMsg =
                'return {0} to the ' + (this.bottom ? 'bottom' : 'top') + " of their owner's deck";
        }
    }

    setTarget(target) {
        this.originalTarget = target;
        super.setTarget(target);
    }

    getEventArray(context) {
        let shufflePlayer = context.player;
        if (this.shuffle && !this.shuffleDiscardIntoDeck) {
            // Figure out if the entire discard has been shuffled into the
            // deck for either player.
            if (
                this.target.length === context.player.discard.length &&
                this.target.every((c) => context.player.discard.includes(c))
            ) {
                this.shuffleDiscardIntoDeck = context.player.discard === this.originalTarget;
            }

            if (
                !this.shuffleDiscardIntoDeck &&
                context.player.opponent &&
                this.target.length === context.player.opponent.discard.length &&
                this.target.every((c) => context.player.opponent.discard.includes(c))
            ) {
                this.shuffleDiscardIntoDeck =
                    context.player.opponent.discard === this.originalTarget;
                shufflePlayer = context.player.opponent;
            }
        }

        if (this.target.length === 0 && this.shuffle) {
            shufflePlayer.shuffleDeck(this.shuffleDiscardIntoDeck);
        }

        return super.getEventArray(context);
    }

    getEvent(card, context) {
        let eventName = card.location === 'play area' ? 'onCardLeavesPlay' : 'onMoveCard';
        let deckLength = card.owner.getSourceList('deck').length;

        return super.createEvent(
            eventName,
            { card: card, context: context, deckLength: deckLength },
            () => {
                card.owner.moveCard(card, 'deck', {
                    bottom: this.bottom,
                    aboutToShuffle: this.shuffle
                });
                let cardsByOwner = this.target.filter((c) => c.owner === card.owner);
                if (
                    this.shuffle &&
                    cardsByOwner.findIndex((c) => c === card) === cardsByOwner.length - 1
                ) {
                    card.owner.shuffleDeck(this.shuffleDiscardIntoDeck);
                }
            }
        );
    }
}

module.exports = ReturnToDeckAction;
