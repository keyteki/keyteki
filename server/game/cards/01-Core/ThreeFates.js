import Card from '../../Card.js';

class ThreeFates extends Card {
    // Play: Destroy the 3most powerful creatures.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                numCards: 3,
                cardStat: (card) => card.power,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

ThreeFates.id = 'three-fates';

export default ThreeFates;
