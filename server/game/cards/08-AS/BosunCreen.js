import Card from '../../Card.js';

class BosunCreen extends Card {
    // Scrap: Move a creature to a flank of its controller’s battleline.
    setupCardAbilities(ability) {
        this.scrap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.moveToFlank()
            }
        });
    }
}

BosunCreen.id = 'bosun-creen';

export default BosunCreen;
