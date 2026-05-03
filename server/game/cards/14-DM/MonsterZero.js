const GiganticCard = require('../../GiganticCard.js');

class MonsterZero extends GiganticCard {
    // (Play only with the other half of Monster Zero.)
    // Deploy.
    // Each of Monster Zero's neighbors belongs to house Mars (instead of its other houses).
    // Play: Give Monster Zero a number of +1 power counters equal to the most powerful friendly creature's power.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.changeHouse('mars')
        });

        this.play({
            gameAction: ability.actions.addPowerCounter((context) => {
                const maxPower = context.player.creaturesInPlay.reduce(
                    (max, c) => Math.max(max, c.power),
                    0
                );
                return {
                    amount: maxPower,
                    target: context.source
                };
            })
        });
    }
}

MonsterZero.id = 'monster-zero';

module.exports = MonsterZero;
