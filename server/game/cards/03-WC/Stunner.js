const Card = require('../../Card.js');

class Stunner extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                may: 'stun a creature',
                fight: true,
                target: {
                    numCards: 1,
                    optional: true,
                    cardType: ['creature'],
                    gameAction: ability.actions.stun()
                }
            })
        });
    }
}

Stunner.id = 'stunner';

module.exports = Stunner;
