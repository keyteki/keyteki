import PlayerAction from './PlayerAction.js';

class DiscardTopOfDeckAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'discard-top-of-deck';
        this.effectMsg =
            'discard ' +
            (this.amount === 1 ? 'a card' : this.amount + ' cards') +
            " from the top of {0}'s deck";
    }

    canAffect(player, context) {
        return this.amount > 0 && player.deck.length > 0 && super.canAffect(player, context);
    }

    getEvent(player, context) {
        let amount = Math.min(this.amount, player.deck.length);
        return super.createEvent('unnamedEvent', { player, context, amount }, (event) => {
            let cards = player.deck.slice(0, event.amount);
            context.game.actions.discard({ chatMessage: false }).resolve(cards, context);
        });
    }
}

export default DiscardTopOfDeckAction;
