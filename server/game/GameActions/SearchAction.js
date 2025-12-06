const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

class SearchAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = null;
        this.location = ['deck', 'discard'];
        this.reveal = true;
        this.cardName = null;
        this.uniqueCardNames = false;
        this.exactly = false;
    }

    setup() {
        super.setup();

        this.name = 'search';
        this.effectMsg =
            'search their ' +
            this.location.join(' and ') +
            ' for ' +
            (this.cardName
                ? this.cardName
                : !this.amount || this.amount === 1
                ? 'a card'
                : (this.exactly ? 'exactly ' : 'up to ') + this.amount + ' cards');
    }

    canAffect(player, context) {
        return (this.amount || this.cardName) && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent(
            EVENTS.onSearch,
            { player: player, context: context, location: this.location },
            (event) => {
                context.game.promptForSelect(context.game.activePlayer, {
                    location: this.location,
                    controller: 'self',
                    context: context,
                    numCards: this.amount,
                    uniqueCardNames: this.uniqueCardNames,
                    cardCondition: (card) =>
                        this.cardCondition
                            ? this.cardCondition(card)
                            : !this.cardName || card.name === this.cardName,
                    mode: this.amount > 0 ? (this.exactly ? 'exactly' : 'upTo') : 'unlimited',
                    onSelect: (player, cards) => {
                        event.searchedCards = cards;
                        if (cards.length > 0) {
                            let cardMessageInfo = '{1}';
                            if (!this.reveal) {
                                cardMessageInfo = cards.length === 1 ? 'a card' : '{2} cards';
                            }

                            switch (this.destination) {
                                case 'discard':
                                    context.game.addMessage(
                                        `{0} discards ${cardMessageInfo}`,
                                        player,
                                        cards,
                                        cards.length
                                    );
                                    break;
                                case 'archives':
                                    context.game.addMessage(
                                        `{0} archives ${cardMessageInfo}`,
                                        player,
                                        cards,
                                        cards.length
                                    );
                                    break;
                                case 'deck':
                                    context.game.addMessage(
                                        `{0} puts ${cardMessageInfo} on top of their deck`,
                                        player,
                                        cards,
                                        cards.length
                                    );
                                    break;
                                default:
                                    context.game.addMessage(
                                        `{0} takes ${cardMessageInfo} into their hand`,
                                        player,
                                        cards,
                                        cards.length
                                    );
                            }

                            if (this.location.includes('deck')) {
                                player.shuffleDeck();
                            }

                            for (let card of cards) {
                                switch (this.destination) {
                                    case 'discard':
                                        context.game.actions
                                            .discard({ chatMessage: false })
                                            .resolve(card, context);
                                        break;
                                    case 'archives':
                                        context.game.actions.archive().resolve(card, context);
                                        break;
                                    case 'deck':
                                        context.game.actions.returnToDeck().resolve(card, context);
                                        break;
                                    default:
                                        player.moveCard(card, 'hand');
                                }
                            }
                        } else {
                            context.game.addMessage("{0} doesn't take anything", player);

                            if (this.location.includes('deck')) {
                                player.shuffleDeck();
                            }
                        }

                        return true;
                    }
                });
            }
        );
    }
}

module.exports = SearchAction;
