import Card from '../../Card.js';

class Sandwyrm extends Card {
    // After Fight: Shuffle Sandwyrm into your deck.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.returnToDeck({
                shuffle: true
            })
        });
    }
}

Sandwyrm.id = 'sandwyrm';

export default Sandwyrm;
