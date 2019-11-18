const Card = require('../../Card.js');

class ArmageddonCloak extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ hazardous: 2 }),
                ability.effects.gainAbility('destroyed', {
                    message: {
                        format: 'heal all damage from {source} and destroy {this} instead',
                        args: { this: () => this }
                    },
                    gameAction: [
                        ability.actions.heal({ fully: true }),
                        ability.actions.changeEvent(context => ({
                            event: context.event,
                            card: this,
                            postHandler: context => context.source.moribund = false
                        }))
                    ]
                })
            ]
        });
    }
}

ArmageddonCloak.id = 'armageddon-cloak';

module.exports = ArmageddonCloak;
