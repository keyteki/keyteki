const Card = require('../../Card.js');

class TheColosseum extends Card {
    // After an enemy creature is destroyed while fighting, put a glory counter on The Colosseum.
    // Omni: If there are 6 or more glory counters on The Colosseum, remove 6 and forge a key at current cost.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting &&
                    event.clone.controller !== context.player &&
                    event.clone.type === 'creature'
            },
            effect: 'place a glory counter on itself due to {1} being destroyed',
            effectArgs: (context) => [context.event.card],
            gameAction: ability.actions.addGloryCounter()
        });
        this.omni({
            effect: '{1}',
            effectArgs: (context) => [
                this.tokens.glory >= 6 && context.player.amber >= context.player.getCurrentKeyCost()
                    ? 'discard 6 glory counters and forge a key at current cost'
                    : this.tokens.glory >= 6 &&
                      context.player.amber < context.player.getCurrentKeyCost()
                    ? 'discard 6 glory counters'
                    : 'do nothing'
            ],
            gameAction: ability.actions.clearGloryCounters(() => {
                return { amount: this.tokens.glory >= 6 ? 6 : 0 };
            }),
            then: {
                gameAction: ability.actions.forgeKey()
            }
        });
    }
}

TheColosseum.id = 'the-colosseum';

module.exports = TheColosseum;
