const Card = require('../../Card.js');

class CROfficerHawkins extends Card {
    //Deploy.
    //Play: Gain 1A for each of $this' non-Star Alliance neighbors.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: deploy
        this.play({
            gameAction: ability.actions.gainAmber((context) => ({
                amount:
                    1 *
                    context.game.creaturesInPlay.filter(
                        (card) =>
                            context.source.neighbors.includes(card) &&
                            !card.hasHouse('staralliance')
                    ).length
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

CROfficerHawkins.id = 'cr-officer-hawkins-';

module.exports = CROfficerHawkins;
