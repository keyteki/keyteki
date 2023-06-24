const Card = require('../../Card.js');

class FreshMarks extends Card {
    //Play: Destroy a friendly creature. If you do, exalt 3 enemy creatures.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    numCards: '3',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.exalt({ amount: 1 })
                }
            }
        });
    }
}

FreshMarks.id = 'fresh-marks';

module.exports = FreshMarks;
