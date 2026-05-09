const Card = require('../../Card.js');

class RiaBevyGress extends Card {
    // Enhance power power power.
    // After Fight/After Reap: If you are overwhelmed, capture 1A for each +1 power counter on friendly creatures. Otherwise, capture 1A.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.isOverwhelmed()
                    ? context.player.creaturesInPlay.reduce(
                          (total, card) => total + card.powerCounters,
                          0
                      )
                    : 1,
                target: context.source
            }))
        });
    }
}

RiaBevyGress.id = 'ria-bevy-gress';

module.exports = RiaBevyGress;
