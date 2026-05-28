const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

class DiscardTopOfDeckAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.chatMessage = true;
    }

    setup() {
        super.setup();
        this.name = 'discard-top-of-deck';
        // We emit our own per-player chat message during execution (see
        // `getEvent` below); the parent ability skips its bare "uses
        // {source}" message because of `defersMessage`.
        this.defersMessage = true;
    }

    canAffect(player, context) {
        return this.amount > 0 && player.deck.length > 0 && super.canAffect(player, context);
    }

    getEvent(player, context) {
        let amount = Math.min(this.amount, player.deck.length);
        return super.createEvent(EVENTS.unnamedEvent, { player, context, amount }, (event) => {
            let cards = player.deck.slice(0, event.amount);
            if (cards.length > 0 && this.chatMessage) {
                context.game.addMessage(
                    "{0} uses {1} to discard {2} from the top of {3}'s deck",
                    context.player,
                    context.source,
                    cards,
                    player
                );
            }
            context.game.actions.discard({ chatMessage: false }).resolve(cards, context);
        });
    }
}

module.exports = DiscardTopOfDeckAction;
