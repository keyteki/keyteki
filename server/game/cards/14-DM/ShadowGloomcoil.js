const Card = require('../../Card.js');

class ShadowGloomcoil extends Card {
    // Treachery. Versatile.
    // After a friendly creature is used, deal 1 to each friendly creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    event.card.type === 'creature' && event.card.controller === context.player
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.player.creaturesInPlay
            })),
            effect: 'deal 1 damage to each friendly creature'
        });
    }
}

ShadowGloomcoil.id = 'shadow-gloomcoil';

module.exports = ShadowGloomcoil;
