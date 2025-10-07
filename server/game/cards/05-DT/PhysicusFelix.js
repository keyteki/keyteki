import Card from '../../Card.js';

class PhysicusFelix extends Card {
    // (T) Play/Fight: If the tide is high, you may exalt a creature.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            condition: (context) => context.player.isTideHigh(),
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.exalt()
            }
        });
    }
}

PhysicusFelix.id = 'physicus-felix';

export default PhysicusFelix;
