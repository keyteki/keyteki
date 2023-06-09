const Card = require('../../Card.js');

class ZParticleTracker extends Card {
    // This creature gains, "Fight: Search your deck for an upgrade and put it into your hand. Shuffle your deck."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('fight', {
                effect: 'search their deck for an upgrade and put it in their hand',
                gameAction: ability.actions.search({
                    cardCondition: (card) => card.type === 'upgrade',
                    location: ['deck'],
                    reveal: false,
                    amount: 1
                })
            })
        });
    }
}

ZParticleTracker.id = 'z-particle-tracker';

module.exports = ZParticleTracker;
