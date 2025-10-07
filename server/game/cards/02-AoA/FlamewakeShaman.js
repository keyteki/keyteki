import Card from '../../Card.js';

class FlamewakeShaman extends Card {
    // Play: Deal 2D to a creature.
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

export default FlamewakeShaman;
