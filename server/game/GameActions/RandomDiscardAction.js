const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        // hand or archives
        this.location = 'hand';
    }

    setup() {
        super.setup();
        this.name = 'discard';
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
        return super.createEvent('unnamedEvent', { player, context }, (event) => {
            let amount = Math.min(this.amount, player.hand.length);
            if (this.location === 'archives') {
                amount = Math.min(this.amount, player.archives.length);
            }

            event.cards = _.shuffle(player.hand).slice(0, amount);
            if (this.location === 'archives') {
                event.cards = _.shuffle(player.archives).slice(0, amount);
            }

            context.game.addMessage('{0} discards {1} at random', player, event.cards);
            context.game.actions.discard().resolve(event.cards, context);
        });
    }
}

module.exports = RandomDiscardAction;
