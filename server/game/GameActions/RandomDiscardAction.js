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
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(
            'unnamedEvent',
            { player, context, amount: this.amount },
            (event) => {
                if (this.location === 'archives') {
                    event.cards = _.shuffle(player.archives).slice(0, event.amount);
                } else if (this.location === 'deck') {
                    event.cards = _.shuffle(player.deck).slice(0, event.amount);
                } else {
                    event.cards = _.shuffle(player.hand).slice(0, event.amount);
                }

                context.game.addMessage('{0} discards {1} at random', player, event.cards);
                context.game.actions.discard().resolve(event.cards, context);
            }
        );
    }
}

module.exports = RandomDiscardAction;
