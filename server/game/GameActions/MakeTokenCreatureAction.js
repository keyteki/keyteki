const PlayerAction = require('./PlayerAction');

class MakeTokenCreatureAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.deployIndex = undefined;
        this.cards = null;
        this.cardLocation = 'deck';
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
        return this.amount === 0 || !player.tokenCard || player.deck.length === 0
            ? false
            : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(
            'onMakeToken',
            { player, context, amount: this.amount },
            (event) => {
                if (this.cards && this.cards.length > 0) {
                    event.cards = this.cards;
                } else {
                    event.cards = player.deck.slice(0, event.amount);
                }

                context.game.actions
                    .sequentialForEach((context) => {
                        return {
                            forEach: event.cards,
                            action: (card) =>
                                context.game.actions.sequential([
                                    context.game.actions.cardLastingEffect({
                                        target: card,
                                        targetLocation: this.cardLocation,
                                        duration: 'lastingEffect',
                                        effect: [
                                            context.game.effects.flipToken(),
                                            context.game.effects.changeType('creature'),
                                            context.game.effects.copyCard(player.tokenCard, false)
                                        ]
                                    }),
                                    context.game.actions.putIntoPlay({
                                        target: card,
                                        deployIndex: this.deployIndex
                                    })
                                ])
                        };
                    })
                    .resolve(context.source, context);
            }
        );
    }
}

module.exports = MakeTokenCreatureAction;
