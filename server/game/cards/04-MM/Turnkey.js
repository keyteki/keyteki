const Card = require('../../Card.js');

class Turnkey extends Card {
    // Play: Unforge an opponents key. If you do, when Turnkey leaves play, your opponent forges a key at no cost.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.getForgedKeys() > 0,
            effect: 'cause {1} to unforge a key',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.unforgeKey(),
            then: {
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.lastingAbilityTrigger({
                        when: {
                            onCardLeavesPlay: (event, context) => event.card === context.source
                        },
                        gameAction: ability.actions.forgeKey({
                            target: context.player.opponent,
                            atNoCost: true
                        }),
                        message: '{0} forges a key at no cost due to {1} leaving play'
                    })
                }))
            }
        });
    }
}

Turnkey.id = 'turnkey';

module.exports = Turnkey;
