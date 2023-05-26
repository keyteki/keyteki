const PlayerAction = require('./PlayerAction');

class MakeTokenCreatureAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.deployIndex = undefined;
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
                event.cards = player.deck.slice(0, event.amount);
                event.cards.forEach((card) => {
                    context.game.actions
                        .cardLastingEffect({
                            target: card,
                            targetLocation: 'deck',
                            duration: 'lastingEffect',
                            effect: [
                                context.game.effects.flipToken(),
                                context.game.effects.changeType('creature'),
                                context.game.effects.copyCard(player.tokenCard, false)
                            ]
                        })
                        .resolve(card, context);

                    context.game.actions
                        .putIntoPlay({
                            target: card,
                            deployIndex: this.deployIndex
                        })
                        .resolve(card, context);
                });
            }
        );
    }
}

module.exports = MakeTokenCreatureAction;
