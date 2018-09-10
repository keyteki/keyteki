const Card = require('../../Card.js');

class OrbitalBombardment extends Card {
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
            effect: 'revealing {0} to deal 2 damage to a creature {1} times',
            effectArgs: context => Array.isArray(context.target) ? context.target.length : 1
        });
    }
}

OrbitalBombardment.id = 'orbital-bombardment'; // This is a guess at what the id might be - please check it!!!

module.exports = OrbitalBombardment;
