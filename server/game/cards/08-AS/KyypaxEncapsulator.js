import Card from '../../Card.js';

class KyypaxEncapsulator extends Card {
    // After Reap: Put an enemy creature into its owner’s archives.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.archive()
            }
        });
    }
}

KyypaxEncapsulator.id = 'kyypax-encapsulator';

export default KyypaxEncapsulator;
