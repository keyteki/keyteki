import Card from '../../Card.js';

class BrillixPonder extends Card {
    // Scrap: Draw a card.
    setupCardAbilities(ability) {
        this.scrap({
            gameAction: ability.actions.draw()
        });
    }
}

BrillixPonder.id = 'brillix-ponder';

export default BrillixPonder;
