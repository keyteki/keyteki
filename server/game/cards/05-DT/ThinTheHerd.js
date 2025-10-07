import Card from '../../Card.js';

class ThinTheHerd extends Card {
    // Play: Shuffle the 4 least powerful creatures into their owners’ decks.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'leastStat',
                cardType: 'creature',
                numCards: 4,
                cardStat: (card) => card.power,
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            }
        });
    }
}

ThinTheHerd.id = 'thin-the-herd';

export default ThinTheHerd;
