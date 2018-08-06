const DrawCard = require('../../drawcard.js');

class EmbraceTheVoid extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Take Fate',
            when: {
                onMoveFate: (event, context) => event.origin === context.source.parent && event.fate > 0
            },
            effect: 'take the {1} fate being removed from {2}',
            effectArgs: context => [context.event.fate, context.source.parent],
            handler: context => {
                let newEvent = context.event.window.addEvent(ability.actions.removeFate({
                    recipient: context.player,
                    amount: context.event.fate
                }).getEvent(context.source.parent, context));
                context.event.getResult = () => newEvent.getResult();
                newEvent.order = context.event.order;
                context.cancel();
            }
        });
    }

    canPlay(context) {
        if(!context.player.cardsInPlay.any(card => card.getType() === 'character' && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context);
    }
}

EmbraceTheVoid.id = 'embrace-the-void';

module.exports = EmbraceTheVoid;
