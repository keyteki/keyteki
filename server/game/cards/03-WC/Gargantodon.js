const Card = require('../../Card.js');

class Gargantodon extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.stun()
        });

        this.persistentEffect({
            match: this,
            effect: ability.effects.limitFightDamage(4)
        });

        this.interrupt({
            when: {
                onStealAmber: () => true
            },
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => card.controller === context.player,
                gameAction: [
                    ability.actions.changeEvent(context => ({
                        event: context.event,
                        cancel: true
                    })),
                    ability.actions.capture(context => ({
                        amount: context.event.amount,
                        target: context.target
                    }))
                ]
            }
        });
    }
}

Gargantodon.id = 'gargantodon';

module.exports = Gargantodon;
