const Card = require('../../Card.js');

class ParadoxShield extends Card {
    // This creature gains “Destroyed: Discard cards from the top of
    // your deck equal to this creature’s power. If you do, fully heal
    // this creature and destroy Paradox Shield instead.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('destroyed', {
                    condition: (context) =>
                        context.source.controller.deck.length >= context.source.power,
                    effect:
                        'discard {2} cards from their deck to heal all damage from {0} and destroy {1} instead',
                    effectArgs: (context) => [this, context.source.power],
                    gameAction: ability.actions.discard((context) => ({
                        target: context.source.controller.deck.slice(0, context.source.power)
                    })),
                    then: (preThenContext) => ({
                        gameAction: [
                            ability.actions.heal({ fully: true }),
                            ability.actions.changeEvent({
                                event: preThenContext.event,
                                card: this,
                                postHandler: (context) => (context.source.moribund = false)
                            }),
                            ability.actions.changeEvent({
                                event: preThenContext.event.triggeringEvent,
                                destroyedByDamageDealt: false,
                                destroyedFighting: false,
                                card: this
                            })
                        ]
                    })
                })
            ]
        });
    }
}

ParadoxShield.id = 'paradox-shield';

module.exports = ParadoxShield;
