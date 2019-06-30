const Card = require('../../Card.js');

class FlamewakeShaman extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

FlamewakeShaman.id = 'flamewake-shaman';

module.exports = FlamewakeShaman;
