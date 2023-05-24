const Card = require('../../Card.js');

class Outnegotiate extends Card {
    setupCardAbilities(ability) {
        this.play({
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
