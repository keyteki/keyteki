const Card = require('../../Card.js');

class CleansingWave extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.heal(context => ({
                amount: 1,
                target: context.game.creaturesInPlay
            })),
            then: {
                gameAction: ability.actions.gainAmber(context => ({
                    amount: context.preThenEvents.filter(event => !event.cancelled).length
                }))
            }
        });
    }
}

CleansingWave.id = 'cleansing-wave'; // This is a guess at what the id might be - please check it!!!

module.exports = CleansingWave;
