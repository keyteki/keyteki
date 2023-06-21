const Card = require('../../Card.js');

class Outnegotiate extends Card {
    // Play: Choose a card in your opponents discard pile. Steal  equal to the number of  bonus icons on that card and put that card on the bottom of its owners deck.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: `all`,
            target: {
                controller: 'opponent',
                location: 'discard',
                gameAction: [
                    ability.actions.steal((context) => ({
                        target: context.target.owner,
                        amount: context.target.bonusIcons.length
                    })),
                    ability.actions.returnToDeck({ bottom: true })
                ]
            }
        });
    }
}

Outnegotiate.id = 'outnegotiate';

module.exports = Outnegotiate;
