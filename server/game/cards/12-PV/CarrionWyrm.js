import Card from '../../Card.js';

class CarrionWyrm extends Card {
    // After Reap: Destroy an enemy creature.
    // Scrap: Put an enemy creature on top of its owner's deck.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            }
        });

        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.returnToDeck({ shuffle: false })
            }
        });
    }
}

CarrionWyrm.id = 'carrion-wyrm';

export default CarrionWyrm;
