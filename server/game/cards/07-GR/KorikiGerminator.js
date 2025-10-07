import Card from '../../Card.js';

class KorikiGerminator extends Card {
    // Play/After Reap: Put a card from a player's discard pile on the
    // bottom of their deck.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                controller: 'any',
                location: 'discard',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            }
        });
    }
}

KorikiGerminator.id = 'koriki-germinator';

export default KorikiGerminator;
