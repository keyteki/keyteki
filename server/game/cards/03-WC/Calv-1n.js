const Card = require('../../Card.js');

class Calv1N extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.draw()
        });

        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        this.whileAttached({
            effect: [
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.draw()
                }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.draw()
                })
            ]
        });
    }
}

Calv1N.id = 'calv-1n';

module.exports = Calv1N;
