const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');
const RemoveTokenAction = require('./RemoveTokenAction');

class RemoveAllTokensAction extends CardGameAction {
    setup() {
        this.name = 'removeAllTokens';
        this.targetType = ['creature'];
        this.effectMsg = 'remove all counters from {0}';
    }

    checkEventCondition(event) {
        return event.card.sumTokens() > 0 && super.checkEventCondition(event);
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(
            EVENTS.onRemoveAllTokens,
            {
                card: card,
                context: context
            },
            (event) => {
                context.game.actions
                    .sequential(
                        Object.keys(event.card.tokens).map(
                            (type) =>
                                new RemoveTokenAction({
                                    context: event.context,
                                    card: event.card,
                                    type: type,
                                    all: true
                                })
                        )
                    )
                    .resolve(context.source, context);
            }
        );
    }
}

module.exports = RemoveAllTokensAction;
