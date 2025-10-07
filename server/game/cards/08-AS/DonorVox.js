import Card from '../../Card.js';

class DonorVox extends Card {
    // Scrap: Give a friendly Mars creature two +1 power counters.
    setupCardAbilities(ability) {
        this.scrap({
            target: {
                cardCondition: (card) => card.hasHouse('mars'),
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.addPowerCounter({ amount: 2 })
            },
            effect: 'give {0} two +1 power counters'
        });
    }
}

DonorVox.id = 'donor-vox';

export default DonorVox;
