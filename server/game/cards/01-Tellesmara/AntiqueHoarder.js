const Card = require('../../Card.js');

class AntiqueHoarder extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                // todo: OnAttack: (event => event.card.type)
            },
            gameAction: ability.actions.dealDamage({ amount: 1 })
        });
    }
}

AntiqueHoarder.id = 'antiquehoarder';

module.exports = AntiqueHoarder;
