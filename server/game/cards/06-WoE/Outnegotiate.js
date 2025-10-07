import Card from '../../Card.js';

class Outnegotiate extends Card {
    // Play: Choose a card in your opponent's discard pile. Steal
    // Aember equal to the number of Aember bonus icons on it and put
    // that card on the bottom of its owner's deck.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: `all`,
            target: {
                controller: 'opponent',
                location: 'discard',
                gameAction: [
                    ability.actions.steal((context) => ({
                        target: context.target.owner,
                        amount: context.target.bonusIcons.filter((icon) => icon === 'amber').length
                    })),
                    ability.actions.returnToDeck({ bottom: true })
                ]
            }
        });
    }
}

Outnegotiate.id = 'outnegotiate';

export default Outnegotiate;
