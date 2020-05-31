const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomPurgeAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        // hand or archives
        this.location = 'hand';
    }

    setup() {
        super.setup();
        this.name = 'purge';
        this.effectMsg =
            'purge ' +
            (this.amount === 1 ? 'a card' : this.amount + ' cards') +
            ' at random from their ' +
            this.location;
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player, context }, () => {
            let amount = Math.min(this.amount, player.hand.length);
            let cards = _.shuffle(player.hand).slice(0, amount);
            if (this.location === 'archives') {
                amount = Math.min(this.amount, player.archives.length);
                cards = _.shuffle(player.archives).slice(0, amount);
            }

            context.game.addMessage('{0} purges {1} at random', player, cards);
            context.game.actions.purge().resolve(cards, context);
        });
    }
}

module.exports = RandomPurgeAction;
