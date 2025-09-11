const Card = require('../../Card.js');

class RicketyCybergiant extends Card {
    // After Fight: Deal 1 D to Rickety Cybergiant.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.source
            }))
        });
    }
}

RicketyCybergiant.id = 'rickety-cybergiant';

module.exports = RicketyCybergiant;
