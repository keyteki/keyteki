const Card = require('../../Card.js');

class LordGolgotha extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            effect: 'deal 3 damage to each of {1}\'s neighbors',
            effectArgs: context => context.event.card,
            gameAction: ability.actions.dealDamage(context => ({
                amount: 3,
                target: context.event.card.neighbors
            }))
        });
    }
}

LordGolgotha.id = 'lord-golgotha'; // This is a guess at what the id might be - please check it!!!

module.exports = LordGolgotha;
