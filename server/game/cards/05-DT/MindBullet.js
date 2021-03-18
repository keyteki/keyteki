const Card = require('../../Card.js');

class MindBullet extends Card {
    //Play: Deal 1D to each creature for each card you played this turn (including this one.)
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.creaturesInPlay,
                amount: context.game.cardsPlayed.length
            }))
        });
    }
}

MindBullet.id = 'mind-bullet';

module.exports = MindBullet;
