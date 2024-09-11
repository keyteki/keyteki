const Card = require('../../Card.js');

class GammaBlaster extends Card {
    // This creature gains, “After Reap: Destroy an enemy creature with A on it.”
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) => event.card === context.source.parent
            },
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.hasToken('amber'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

GammaBlaster.id = 'gamma-blaster';

module.exports = GammaBlaster;
