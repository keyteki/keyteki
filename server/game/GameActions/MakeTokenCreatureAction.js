const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class MakeTokenCreatureAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.deploy = false;
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

    targetsCanChangeViaSimultaneousAction(context) {
        const player = this.targetPlayer(context);
        if (!player) {
            return false;
        }

        // If any simultaneous action makes us refill the deck (e.g., via shuffling the discard pile),
        // we need to allow the player to choose which ability to use first.
        return true;
    }

    getEvent(card, context) {
        return super.createEvent(
            EVENTS.onMakeToken,
            { card, context, player: this.targetPlayer(context) },
            (event) => {
                context.game.actions
                    .sequential([
                        context.game.actions.cardLastingEffect({
                            target: card,
                            allowedLocations: 'any',
                            duration: 'lastingEffect',
                            effect: [
                                context.game.effects.flipToken(),
                                context.game.effects.changeType('creature'),
                                context.game.effects.copyCard(event.player.tokenCard, false)
                            ]
                        }),
                        context.game.actions.putIntoPlay({
                            target: card,
                            deploy: this.deploy,
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
