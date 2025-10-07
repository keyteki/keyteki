import Card from '../../Card.js';

class BabblingBibliophile extends Card {
    // Reap: Draw 2 cards.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw({
                amount: 2
            })
        });
    }
}

BabblingBibliophile.id = 'babbling-bibliophile';
export default BabblingBibliophile;
