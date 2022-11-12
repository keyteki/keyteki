const PlayerAction = require('./PlayerAction');

class MakeTokenCreatureAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.cards = null;
    }

    setup() {
        super.setup();
        this.name = 'makeToken';
        this.effectMsg =
            'make ' + (this.amount === 1 ? 'a token creature' : `${this.amount} token creatures`);
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return this.amount === 0 || !player.hasTokenCard()
            ? false
            : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(
            'onMakeToken',
            { player, context, amount: this.amount, cards: this.cards },
            (event) => {
                let cards = event.cards === null ? player.deck.slice(0, event.amount) : event.cards;
                let tokenCards = cards.map((card) => player.makeTokenCard(card));

                event.cards = tokenCards;
                context.game.actions.putIntoPlay().resolve(event.cards, context);
            }
        );
    }
}

module.exports = MakeTokenCreatureAction;
