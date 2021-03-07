const Card = require('../../Card.js');
const SimpleEventTracker = require('../../SimpleEventTracker.js');

class TalmageSteelheart extends Card {
    //Play: Give $this a +1 power counter for each card you have played this turn (including this one).
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.playTracker = new SimpleEventTracker(this.game, 'play');
        this.play({
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.source,
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

TalmageSteelheart.id = 'talmage-steelheart-';

module.exports = TalmageSteelheart;
