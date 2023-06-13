const Card = require('../../Card.js');

class CleansingWave extends Card {
    // Play: Heal 1 damage from each creature. Gain 1<A> for each creature healed this way.
    setupCardAbilities(ability) {
        this.play({
            effect: 'heal 1 damage from all creatures',
            gameAction: ability.actions.heal((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter((card) => card.hasToken('damage'))
            })),
            then: {
                message: '{1} heals {3}, gaining {0} {4} amber',
                messageArgs: (context) => {
                    let successfulEvents = context.preThenEvents.filter(
                        (event) => !event.cancelled && event.amount > 0
                    );
                    return [successfulEvents.map((event) => event.card), successfulEvents.length];
                },
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvents.filter(
                        (event) => !event.cancelled && event.amount > 0
                    ).length
                }))
            }
        });
    }
}

CleansingWave.id = 'cleansing-wave';

module.exports = CleansingWave;
