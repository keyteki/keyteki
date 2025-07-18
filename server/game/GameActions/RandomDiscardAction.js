const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        // hand, deck or archives
        this.location = 'hand';
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg =
            'discard ' +
            (this.amount === 1 ? 'a card' : `${this.amount} cards`) +
            ` at random from {0}'s ${this.location}`;
    }

    canAffect(player, context) {
        return (
            this.amount > 0 && this.getCards(player).length > 0 && super.canAffect(player, context)
        );
    }

    getCards(player) {
        switch (this.location) {
            case 'archives':
                return player.archives;
            case 'deck':
                return player.deck;
            default:
                return player.hand;
        }
    }

    getEvent(player, context) {
        return super.createEvent(
            'unnamedEvent',
            { player, context, amount: this.amount },
            (event) => {
                event.cards = _.shuffle(this.getCards(player)).slice(0, event.amount);
                context.game.addMessage('{0} discards {1} at random', player, event.cards);
                context.game.actions.discard({ chatMessage: false }).resolve(event.cards, context);
            }
        );
    }
}

module.exports = RandomDiscardAction;
