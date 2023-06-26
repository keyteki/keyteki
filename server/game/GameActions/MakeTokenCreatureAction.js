const CardGameAction = require('./CardGameAction');

class MakeTokenCreatureAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.deployIndex = undefined;
        this.player = null;
    }

    setup() {
        super.setup();
        this.name = 'makeToken';
        this.effectMsg =
            'make ' + (this.amount === 1 ? 'a token creature' : `${this.amount} token creatures`);
    }

    targetPlayer(context) {
        return this.player || context.player;
    }

    defaultTargets(context) {
        const player = this.targetPlayer(context);
        return player != null ? player.deck.slice(0, this.amount) : super.defaultTargets(context);
    }

    canAffect(card, context) {
        const player = this.targetPlayer(context);
        return player && player.tokenCard && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(
            'onMakeToken',
            { card, context, player: this.targetPlayer(context) },
            (event) => {
                context.game.actions
                    .sequential([
                        context.game.actions.cardLastingEffect({
                            target: card,
                            targetLocation: card.location,
                            duration: 'lastingEffect',
                            effect: [
                                context.game.effects.flipToken(),
                                context.game.effects.changeType('creature'),
                                context.game.effects.copyCard(event.player.tokenCard, false)
                            ]
                        }),
                        context.game.actions.putIntoPlay({
                            target: card,
                            deployIndex: this.deployIndex,
                            promptSource: event.player.tokenCard
                        })
                    ])
                    .resolve(context.source, context);
            }
        );
    }
}

module.exports = MakeTokenCreatureAction;
