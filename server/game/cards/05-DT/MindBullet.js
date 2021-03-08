const Card = require('../../Card.js');
const SimpleEventTracker = require('../../SimpleEventTracker.js');

class MindBullet extends Card {
    //Play: Deal 1D to each creature for each card you played this turn (including this one.)
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.playTracker = new SimpleEventTracker(this.game, 'play');
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.creaturesInPlay,
                amount:
                    1 *
                    this.playTracker.events.filter((event) => event.player === context.player)
                        .length
            }))
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

MindBullet.id = 'mind-bullet';

module.exports = MindBullet;
