const Card = require('../../Card.js');

class Stunner extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                fight: true,
                target: {
                    optional: true,
                    numCards: 1,
                    cardType: ['creature'],
                    gameAction: ability.actions.stun()
                }
            })
        });
    }
}

Stunner.id = 'stunner';

module.exports = Stunner;
