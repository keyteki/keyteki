import Card from '../../Card.js';

class TheroCenturion extends Card {
    // Play/Fight: Capture 1A.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            gameAction: ability.actions.capture()
        });
    }
}

TheroCenturion.id = 'thero-centurion';

export default TheroCenturion;
