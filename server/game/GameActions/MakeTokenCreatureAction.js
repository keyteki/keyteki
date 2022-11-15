const PlayerAction = require('./PlayerAction');

class MakeTokenCreatureAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.deployAt = null;
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
            { player, context, amount: this.amount },
            (event) => {
                let tokenCards = player.deck
                    .slice(0, event.amount)
                    .map((card) => player.makeTokenCard(card));
                event.cards = tokenCards;

                if (!this.deployAt) {
                    event.cards.forEach((card) =>
                        context.game.actions.putIntoPlay().resolve(card, context)
                    );
                } else {
                    // TODO
                }
            }
        );
    }
}

module.exports = MakeTokenCreatureAction;
