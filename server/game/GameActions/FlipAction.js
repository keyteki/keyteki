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
                        .sequential([
                            // We “flip” the card back to whatever type it was
                            // before discarding. Otherwise it will go to the
                            // discard as a creature and that will incorrectly
                            // cause any æmber on it to return to the opponent
                            // rather than the common supply.
                            //
                            // See: https://github.com/keyteki/keyteki/issues/3957
                            context.game.actions.cardLastingEffect({
                                target: card,
                                duration: 'lastingEffect',
                                effect: [
                                    context.game.effects.flipToken(),
                                    context.game.effects.changeType(card.printedType)
                                    // We don’t copy the card effects because we
                                    // don’t want _e.g._ artifacts to be active,
                                    // even for a moment.
                                ]
                            }),
                            context.game.actions.discard({
                                target: card
                            })
                        ])
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
                                    true
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
