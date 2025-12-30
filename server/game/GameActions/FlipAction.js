const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class FlipAction extends CardGameAction {
    setDefaultProperties() {
        /** May be "any", "face-down", or "face-up". */
        this.direction = 'any';
    }

    setup() {
        this.name = 'flip';
        this.targetType = ['creature'];
        this.effectMsg = 'flip {0}';
    }

    canAffect(card, context) {
        return (
            card.location === 'play area' &&
            (this.direction === 'any' ||
                (this.direction === 'face-down' && !card.isToken()) ||
                (this.direction === 'face-up' && card.isToken())) &&
            card.checkRestrictions('flip', context) &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent(
            EVENTS.onFlipToken,
            { card, player: context.player, context },
            () => {
                if (card.isToken() && card.printedType !== 'creature') {
                    context.game.actions
                        .discard({
                            target: card
                        })
                        .resolve(card, context);
                } else {
                    context.game.actions
                        .cardLastingEffect({
                            target: card,
                            allowedLocations: 'any',
                            duration: 'lastingEffect',
                            effect: [
                                context.game.effects.flipToken(),
                                context.game.effects.changeType('creature'),
                                context.game.effects.copyCard(
                                    card.isToken() ? card : card.owner.tokenCard,
                                    false
                                )
                            ]
                        })
                        .resolve(card, context);
                }
            }
        );
    }
}

module.exports = FlipAction;
