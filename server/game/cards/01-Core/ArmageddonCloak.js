const Card = require('../../Card.js');

class ArmageddonCloak extends Card {
    // This creature gains hazardous 2 and, Destroyed: Fully heal this creature and destroy Armageddon Cloak instead.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ hazardous: 2 }),
                ability.effects.gainAbility('destroyed', {
                    effect: 'heal all damage from {0} and destroy {1} instead',
                    effectArgs: () => this,
                    gameAction: ability.actions.replaceDestruction({
                        gameAction: [
                            ability.actions.heal({ fully: true }),
                            ability.actions.destroy({ target: this })
                        ]
                    })
                })
            ]
        });
    }
}

ArmageddonCloak.id = 'armageddon-cloak';

module.exports = ArmageddonCloak;
