const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = 'discard ' + (this.amount === 1 ? 'a card' : this.amount + ' cards') + ' at random';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', {}, () => {
            let amount = Math.min(this.amount, player.hand.length);
            let cards = _.shuffle(player.hand).slice(0, amount);
            context.game.addMessage('{0} discards {1} at random', player, cards);
            context.game.actions.discardCard().resolve(cards, context);
        });
    }
}

module.exports = RandomDiscardAction;
