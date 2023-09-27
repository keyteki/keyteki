const CardGameAction = require('./CardGameAction');

class FlipAction extends CardGameAction {
    setup() {
        this.name = 'flip';
        this.targetType = ['creature'];
        this.effectMsg = 'flip {0}';
    }

    canAffect(card, context) {
        return (
            card.location === 'play area' &&
            card.checkRestrictions('flip', context) &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent('onFlipToken', { card, player: context.player, context }, () => {
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
                        targetLocation: 'play area',
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
        });
    }
}

module.exports = FlipAction;
