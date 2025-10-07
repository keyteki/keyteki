import Card from '../../Card.js';

class DrVerokter extends Card {
    // Elusive.
    // Reap: Put an upgrade or action card from your discard pile on top of your deck.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardCondition: (card) => card.type === 'action' || card.type === 'upgrade',
                location: ['discard'],
                controller: 'self',
                gameAction: ability.actions.returnToDeck()
            }
        });
    }
}

DrVerokter.id = 'dr-verokter';

export default DrVerokter;
