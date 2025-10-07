import Card from '../../Card.js';

class KindrithLongshot extends Card {
    // Elusive. Skirmish.
    // Reap: Deal 2D to a creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

KindrithLongshot.id = 'kindrith-longshot';

export default KindrithLongshot;
