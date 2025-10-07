import Card from '../../Card.js';

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
                },
                message: '{0} uses {1} to exalt {2}'
            }
        });
    }
}

FreshMarks.id = 'fresh-marks';

export default FreshMarks;
