const Card = require('../../Card.js');

class ArmageddonCloak extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ hazardous: 2 }),
                ability.effects.gainAbility('destroyed', {
                    effect: 'heal all damage from {0} and destroy {1} instead',
                    effectArgs: () => this,
                    gameAction: [
                        ability.actions.heal({ fully: true }),
                        ability.actions.changeEvent((context) => ({
                            event: context.event,
                            card: this,
                            postHandler: (context) => (context.source.moribund = false)
                        })),
                        ability.actions.changeEvent((context) => ({
                            event: context.event.triggeringEvent,
                            card: this
                        }))
                    ]
                })
            ]
        });
    }
}

ArmageddonCloak.id = 'armageddon-cloak';

module.exports = ArmageddonCloak;
