const Card = require('../../Card.js');

class HorsemanOfPestilience extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            effect: 'deal 1 damage to all non-Horseman creatures',
            gameActions: ability.actions.dealDamage(context => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter(card => !card.hasTrait('horseman'))
            }))
        });
    }
}

HorsemanOfPestilience.id = 'horseman-of-pestilience'; // This is a guess at what the id might be - please check it!!!

module.exports = HorsemanOfPestilience;
