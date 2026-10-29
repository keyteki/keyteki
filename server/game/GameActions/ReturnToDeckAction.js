const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.bottom = false;
        this.shuffle = false;
        this.shufflePlayer = null;
        this.shuffleDiscardIntoDeck = false;
        this.reveal = false;
        this.orderCards = false;
    }

    setup() {
        super.setup();
        this.name = 'returnToDeck';
        if (this.target.length === 0) {
            this.effectMsg = "return nothing to their owner's deck";
        } else if (this.shuffle) {
            if (
                this.reveal ||
                this.target.every((card) =>
                    ['play area', 'discard', 'purged'].includes(card.location)
                )
            ) {
                this.effectMsg = "return {0} to their owner's deck";
            } else if (this.target.length === 1) {
                this.effectMsg = "return a card to their owner's deck";
            } else {
                this.effectMsg = "return cards to their owner's deck";
            }
        } else {
            if (
                this.reveal ||
                this.target.every((card) =>
                    ['play area', 'discard', 'purged'].includes(card.location)
                )
            ) {
                this.effectMsg =
                    'return {0} to the ' +
                    (this.bottom ? 'bottom' : 'top') +
                    " of their owner's deck";
            } else if (this.target.length === 1) {
                this.effectMsg =
                    'return a card to the ' +
                    (this.bottom ? 'bottom' : 'top') +
                    " of their owner's deck";
            } else {
                this.effectMsg =
                    'return cards to the ' +
                    (this.bottom ? 'bottom' : 'top') +
                    " of their owner's deck";
            }
        }
    }

    setTarget(target) {
        this.originalTarget = target;
        super.setTarget(target);
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        if (!this.orderCards || this.shuffle || this.bottom) {
            return;
        }

        const groups = [];
        for (const card of this.target) {
            const group = groups.find((g) => g[0].owner === card.owner);
            if (group) {
                group.push(card);
            } else {
                groups.push([card]);
            }
        }

        const orderedCards = [];
        const promptForGroup = (remainingGroups, remainingCards) => {
            if (remainingCards.length < 2) {
                orderedCards.push(...remainingCards);
                if (remainingGroups.length === 0) {
                    this.setTarget(orderedCards);
                } else {
                    promptForGroup(remainingGroups.slice(1), remainingGroups[0]);
                }

                return;
            }

            context.game.promptWithHandlerMenu(context.game.activePlayer, {
                activePromptTitle: 'Select first card to return (last one is top)',
                context: context,
                cards: remainingCards,
                cardHandler: (card) => {
                    orderedCards.push(card);
                    promptForGroup(
                        remainingGroups,
                        remainingCards.filter((c) => c !== card)
                    );
                }
            });
        };

        if (groups.length > 0) {
            promptForGroup(groups.slice(1), groups[0]);
        }
    }

    hasLegalTarget(context) {
        let result = super.hasLegalTarget(context);
        // Shuffles with empty target arrays is allowed.
        if (!result && this.shuffle && this.target.length == 0) {
            return true;
        }
        return result;
    }

    getEventArray(context) {
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
            }
        }

        if (this.target.length === 0 && this.shuffle) {
            let shufflePlayer = context.player;
            if (this.shufflePlayer) {
                shufflePlayer = this.shufflePlayer;
            }
            shufflePlayer.shuffleDeck(this.shuffleDiscardIntoDeck);
        }

        return super.getEventArray(context);
    }

    getEvent(card, context) {
        let eventName = card.location === 'play area' ? EVENTS.onCardLeavesPlay : EVENTS.onMoveCard;
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
