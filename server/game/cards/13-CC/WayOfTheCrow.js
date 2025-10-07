import Card from '../../Card.js';

class WayOfTheCrow extends Card {
    // This creature gains elusive.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

WayOfTheCrow.id = 'way-of-the-crow';

export default WayOfTheCrow;
