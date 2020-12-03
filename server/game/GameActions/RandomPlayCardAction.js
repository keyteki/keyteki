const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomPlayCardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.location = 'deck'; // deck, discard, archives
        this.revealOnIllegalTarget = false;
        this.revealOnIllegalTargetMessage = null;
    }

    setup() {
        super.setup();
        this.name = 'play';
        this.effectMsg =
            'play ' + (this.amount === 1 ? 'a card' : this.amount + ' cards') + ' at random';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(
            'unnamedEvent',
            { player, context, amount: this.amount },
            (event) => {
                let cards;
                if (this.location === 'archives') {
                    cards = _.shuffle(player.archives).slice(0, event.amount);
                } else if (this.location === 'discard') {
                    cards = _.shuffle(player.discard).slice(0, event.amount);
                } else {
                    cards = _.shuffle(player.hand).slice(0, event.amount);
                }
                context.game.actions
                    .playCard({
                        revealOnIllegalTarget: this.revealOnIllegalTarget,
                        revealOnIllegalTargetMessage: this.revealOnIllegalTargetMessage
                    })
                    .resolve(cards, context);
            }
        );
    }
}

module.exports = RandomPlayCardAction;
