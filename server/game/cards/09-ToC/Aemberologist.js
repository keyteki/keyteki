import Card from '../../Card.js';
class Amberologist extends Card {
    // Action: Capture 1A.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.capture()
        });
    }
}

Amberologist.id = 'æmberologist';

export default Amberologist;
