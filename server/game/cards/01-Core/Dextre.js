import Card from '../../Card.js';

class Dextre extends Card {
    // Play: Capture 1<A>.
    // Destroyed: Put Dextre on top of your deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture()
        });

        this.destroyed({
            gameAction: ability.actions.returnToDeck()
        });
    }
}

Dextre.id = 'dextre';

export default Dextre;
