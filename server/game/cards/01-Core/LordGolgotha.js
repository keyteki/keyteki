const Card = require('../../Card.js');

class LordGolgotha extends Card {
    setupCardAbilities(ability) {
        this.beforeFight({
            effect: "deal 3 damage to each of {1}'s neighbors",
            effectArgs: (context) => context.event.card,
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 3,
                target: context.event.card.neighbors
            }))
        });
    }
}

LordGolgotha.id = 'lord-golgotha';

module.exports = LordGolgotha;
