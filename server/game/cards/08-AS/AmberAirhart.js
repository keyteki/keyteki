import Card from '../../Card.js';

class AmberAirhart extends Card {
    // After Fight/After Reap: Shuffle Æmber Airhart into its owner’s deck.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            gameAction: ability.actions.returnToDeck({
                shuffle: true
            })
        });
    }
}

AmberAirhart.id = 'æmber-airhart';

export default AmberAirhart;
