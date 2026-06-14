const Card = require('../../Card.js');

class Gargantodon extends Card {
    // Gargantodon enters play stunned.
    // Gargantodon only deals 4D when fighting.
    // Each A that would be stolen is captured by a creature controlled by the active player instead.
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
            effect: 'capture amber instead of stealing it',
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                cancel: true
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.allocateCapture(() => ({
                    numAmber: preThenContext.event.amount,
                    player: preThenContext.event.player,
                    cardCondition: (card) => card.controller === preThenContext.game.activePlayer,
                    controller: 'any',
                    menuTitle: 'Choose a creature to capture amber'
                }))
            })
        });
    }
}

Gargantodon.id = 'gargantodon';

module.exports = Gargantodon;
