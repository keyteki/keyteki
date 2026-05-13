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
        // We emit our own per-player chat message during execution so that
        // we still print proper attribution when used inside aggregate
        // wrappers (e.g. `sequential`) where the parent ability's
        // displayGameActionMessage isn't invoked for us.
        this.defersMessage = true;
    }

    canAffect(player, context) {
        return this.amount > 0 && player.deck.length > 0 && super.canAffect(player, context);
    }

    getEvent(player, context) {
        let amount = Math.min(this.amount, player.deck.length);
        return super.createEvent(EVENTS.unnamedEvent, { player, context, amount }, (event) => {
            let cards = player.deck.slice(0, event.amount);
            if (cards.length > 0 && !context.suppressActionMessages) {
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
