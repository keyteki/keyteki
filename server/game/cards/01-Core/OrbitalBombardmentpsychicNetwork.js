const Card = require('../../Card.js');

class OrbitalBombardmentpsychicNetwork extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose which cards to reveal',
                mode: 'unlimited',
                controller: 'self',
                location: 'hand',
                cardCondition: card => card.hasHouse('mars'),
                gameAction: ability.actions.sequentialForEach(context => ({
                    forEach: context.target,
                    action: ability.actions.dealDamage({
                        amount: 2,
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to deal 2 damage to',
                            cardType: 'creature'
                        }
                    })
                }))
            },
            effect: 'deal 2 damage to a creature for each ready Mars creature they control'
        });
    }
}

OrbitalBombardmentpsychicNetwork.id = 'orbital-bombardmentpsychic-network'; // This is a guess at what the id might be - please check it!!!

module.exports = OrbitalBombardmentpsychicNetwork;
