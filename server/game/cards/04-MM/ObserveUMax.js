const Card = require('../../Card.js');

class ObserveUMax extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.capture()
                }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.capture()
                })
            ]
        });
    }
}

ObserveUMax.id = 'observe-u-max';

module.exports = ObserveUMax;
