const Card = require('../../Card.js');
const SimpleEventTracker = require('../../SimpleEventTracker.js');

class TalmageSteelheartEvilTwin extends Card {
    //Play: Choose an enemy creature. Deal 1D to that creature for each card you have played this turn (including this one).
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.playTracker = new SimpleEventTracker(this.game, 'play');
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount:
                        1 *
                        this.playTracker.events.filter((event) => event.player === context.player)
                            .length
                }))
            }
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

TalmageSteelheartEvilTwin.id = 'talmage-steelheart--evil-twin';

module.exports = TalmageSteelheartEvilTwin;
