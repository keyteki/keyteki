const Card = require('../../Card.js');

class MightyJavelin extends Card {
    // Omni: Sacrifice Mighty Javelin. Deal 4<D> to a creature.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 4 })
            },
            effect: 'sacrifice {1} and deal 4 damage to {0}',
            effectArgs: (context) => context.source,
            gameAction: ability.actions.sacrifice()
        });
    }
}

MightyJavelin.id = 'mighty-javelin';

module.exports = MightyJavelin;
