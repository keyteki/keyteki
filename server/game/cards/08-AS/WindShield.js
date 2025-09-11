const Card = require('../../Card.js');

class WindShield extends Card {
    // This creature gains elusive and “After Reap: A friendly creature captures 1A.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ elusive: 1 }),
                ability.effects.gainAbility('reap', {
                    target: {
                        cardType: 'creature',
                        controller: 'self',
                        gameAction: ability.actions.capture()
                    }
                })
            ]
        });
    }
}

WindShield.id = 'wind-shield';

module.exports = WindShield;
