import Card from '../../Card.js';

class Cadet extends Card {
    // Destroyed: Ready Cadet`s most powerful neighbor.
    setupCardAbilities(ability) {
        this.destroyed({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                numCards: 1,
                cardStat: (card) => card.power,
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.ready()
            }
        });
    }
}

Cadet.id = 'cadet';

export default Cadet;
