import Card from '../../Card.js';

class PhysicusFelixEvilTwin extends Card {
    // (T) Play/Fight: If the tide is low, you may exalt a creature.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            condition: (context) => context.player.isTideLow(),
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.exalt()
            }
        });
    }
}

PhysicusFelixEvilTwin.id = 'physicus-felix-evil-twin';

export default PhysicusFelixEvilTwin;
