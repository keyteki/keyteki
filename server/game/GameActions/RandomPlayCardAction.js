const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomPlayCardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.location = 'deck'; // deck, discard, hand, archives
        this.revealOnIllegalTarget = false;
        this.revealOnIllegalTargetMessage = null;
    }

    setup() {
        super.setup();
        this.name = 'play';
        this.effectMsg =
            'play ' +
            (this.amount === 1 ? 'a card' : this.amount + ' cards') +
            ' at random from their ' +
            this.location;
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
                } else if (this.location === 'discard') {
                    event.cards = _.shuffle(player.discard).slice(0, event.amount);
                } else if (this.location === 'deck') {
                    event.cards = _.shuffle(player.deck).slice(0, event.amount);
                } else {
                    event.cards = _.shuffle(player.hand).slice(0, event.amount);
                }
                context.game.actions
                    .playCard({
                        revealOnIllegalTarget: true,
                        revealOnIllegalTargetMessage: "{0} keeps {2} at their opponent's discard"
                    })
                    .resolve(event.cards, context);
            }
        );
    }
}

module.exports = RandomPlayCardAction;
