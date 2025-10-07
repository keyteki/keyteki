import Card from '../../Card.js';

class LightEverlasting extends Card {
    // Play: Play a Sanctum creature from your discard pile anywhere in your battleline.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature',
                location: 'discard',
                cardCondition: (card) => card.hasHouse('sanctum'),
                gameAction: ability.actions.playCard({ deploy: true })
            }
        });
    }
}

LightEverlasting.id = 'light-everlasting';

export default LightEverlasting;
