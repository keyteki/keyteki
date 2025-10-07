import Card from '../../Card.js';

class DAL33T3R extends Card {
    // After Reap: Return 2 enemy creatures to their owner's hand.
    // Fate: Purge the most powerful friendly creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                mode: 'exactly',
                numCards: 2,
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.returnToHand()
            }
        });

        this.fate({
            target: {
                mode: 'mostStat',
                numCards: 1,
                cardStat: (card) => card.power,
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.purge()
            }
        });
    }
}

DAL33T3R.id = 'dal-33-t3r';

export default DAL33T3R;
