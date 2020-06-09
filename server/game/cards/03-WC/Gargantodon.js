const Card = require('../../Card.js');

class Gargantodon extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayStunned()
        });

        this.persistentEffect({
            effect: ability.effects.limitFightDamage(4)
        });

        this.interrupt({
            when: {
                onStealAmber: () => true
            },
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                cancel: true
            })),
            then: (preThenContext) => ({
                alwaysTrigger: true,
                target: {
                    cardType: 'creature',
                    cardCondition: (card, context) => card.controller === context.game.activePlayer,
                    gameAction: ability.actions.capture({
                        amount: preThenContext.event.amount,
                        player: preThenContext.event.player
                    })
                }
            })
        });
    }
}

Gargantodon.id = 'gargantodon';

module.exports = Gargantodon;
