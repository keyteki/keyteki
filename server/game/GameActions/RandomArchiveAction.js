const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomArchiveAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'archive';
        this.effectMsg =
            'archive ' + (this.amount === 1 ? 'a card' : this.amount + ' cards') + ' at random';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player, context }, () => {
            let amount = Math.min(this.amount, player.hand.length);
            let cards = _.shuffle(player.hand).slice(0, amount);
            context.game.actions.archive().resolve(cards, context);
        });
    }
}

module.exports = RandomArchiveAction;
