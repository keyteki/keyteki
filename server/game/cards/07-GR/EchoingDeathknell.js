const Card = require('../../Card.js');

class EchoingDeathknell extends Card {
    // Play: Deal 1 to each creature. If one or more creatures are
    // destroyed this way, repeat this effect.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: 'all',
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.creaturesInPlay
            })),
            then: (preThenContext) => ({
                condition: (context) =>
                    context.preThenEvents.some(
                        (event) =>
                            event.destroyEvent &&
                            event.destroyEvent.destroyedByDamageDealt &&
                            event.destroyEvent.resolved
                    ),
                gameAction: ability.actions.resolveAbility({ ability: preThenContext.ability })
            })
        });
    }
}

EchoingDeathknell.id = 'echoing-deathknell';

module.exports = EchoingDeathknell;
