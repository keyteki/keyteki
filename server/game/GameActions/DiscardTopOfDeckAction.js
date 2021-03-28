const PlayerAction = require('./PlayerAction');

class DiscardTopOfDeckAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.location = 'deck';
    }

    setup() {
        super.setup();
        this.name = 'discard-top-of-deck';
        this.effectMsg =
            'discard ' +
            (this.amount === 1 ? 'a card' : this.amount + ' cards') +
            ' at random from their ' +
            this.location;
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', {}, () => {
            let amount = Math.min(this.amount, player.deck.length);

            let cards = player.deck.slice(0, amount);

            context.game.addMessage('{0} discards {1} from the top of their deck', player, cards);
            context.game.actions.discard().resolve(cards, context);
        });
    }
}

module.exports = DiscardTopOfDeckAction;
