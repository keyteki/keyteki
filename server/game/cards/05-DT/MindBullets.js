const Card = require('../../Card.js');

class MindBullets extends Card {
    //Play: Deal 1D to each creature for each card you played this turn (including this one)
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.creaturesInPlay,
                amount: context.game.cardsPlayed.length
            }))
        });
    }
}

MindBullets.id = 'mind-bullets';

module.exports = MindBullets;
