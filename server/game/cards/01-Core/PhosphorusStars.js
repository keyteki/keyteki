const Card = require('../../Card.js');

class PhosphorusStars extends Card {
    // Play: Stun each non-Mars creature. Gain 2 chains.
    setupCardAbilities(ability) {
        this.play({
            effect: 'stun each non-Mars creature and gain 2 chains',
            gameAction: [
                ability.actions.stun((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => !card.hasHouse('mars'))
                })),
                ability.actions.gainChains({ amount: 2 })
            ]
        });
    }
}

PhosphorusStars.id = 'phosphorus-stars';

module.exports = PhosphorusStars;
