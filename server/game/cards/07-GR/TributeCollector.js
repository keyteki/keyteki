import Card from '../../Card.js';

class TributeCollector extends Card {
    // Play/After Fight: A friendly creature captures 1 A.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

TributeCollector.id = 'tribute-collector';

export default TributeCollector;
