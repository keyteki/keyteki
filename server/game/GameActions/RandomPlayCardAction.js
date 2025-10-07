import PlayerAction from './PlayerAction.js';
import _ from 'underscore';

class RandomPlayCardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.location = 'deck'; // deck, discard, hand, archives
        this.revealOnIllegalTarget = false;
    }

    setup() {
        super.setup();
        this.name = 'play';
        this.effectMsg =
            'play ' +
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
                } else if (this.location === 'discard') {
                    event.cards = _.shuffle(player.discard).slice(0, event.amount);
                } else if (this.location === 'deck') {
                    event.cards = _.shuffle(player.deck).slice(0, event.amount);
                } else {
                    event.cards = _.shuffle(player.hand).slice(0, event.amount);
                }
                context.game.actions
                    .playCard({
                        revealOnIllegalTarget: this.revealOnIllegalTarget
                    })
                    .resolve(event.cards, context);
            }
        );
    }
}

export default RandomPlayCardAction;
