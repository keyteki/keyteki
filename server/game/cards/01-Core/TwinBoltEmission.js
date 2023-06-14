const Card = require('../../Card.js');

class TwinBoltEmission extends Card {
    // Play: Deal 2<D> to a creature and deal 2<D> to a different creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 2,
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

TwinBoltEmission.id = 'twin-bolt-emission';

module.exports = TwinBoltEmission;
