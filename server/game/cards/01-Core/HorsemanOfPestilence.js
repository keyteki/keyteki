const Card = require('../../Card.js');

class HorsemanOfPestilence extends Card {
    // Play/Fight/Reap: Deal 1<D> to each non-Horseman creature.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            effect: 'deal 1 damage to all non-Horseman creatures',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter((card) => !card.hasTrait('horseman'))
            }))
        });
    }
}

HorsemanOfPestilence.id = 'horseman-of-pestilence';

module.exports = HorsemanOfPestilence;
