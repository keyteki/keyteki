const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

class DiscardTopOfDeckAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'discard-top-of-deck';
        const player = this.target[0];
        const cards = player ? player.deck.slice(0, Math.min(this.amount, player.deck.length)) : [];
        this.effectMsg = "discard {1} from the top of {0}'s deck";
        this.effectArgs = [cards.length > 0 ? cards : 'nothing'];
    }

    canAffect(player, context) {
        return this.amount > 0 && player.deck.length > 0 && super.canAffect(player, context);
    }

    getEvent(player, context) {
        let amount = Math.min(this.amount, player.deck.length);
        return super.createEvent(EVENTS.unnamedEvent, { player, context, amount }, (event) => {
            let cards = player.deck.slice(0, event.amount);
            context.game.actions.discard({ chatMessage: false }).resolve(cards, context);
        });
    }
}

module.exports = DiscardTopOfDeckAction;
