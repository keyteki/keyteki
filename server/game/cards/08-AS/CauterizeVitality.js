const Card = require('../../Card.js');

class CauterizeVitality extends Card {
    // Play: Destroy a creature or artifact. If you do, your opponent
    // loses A equal to the number of bonus icons on the destroyed
    // card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: ['artifact', 'creature'],
                location: 'play area',
                gameAction: ability.actions.destroy()
            },
            then: (preThenContext) => ({
                condition: (context) =>
                    !!preThenContext.target &&
                    !!context.player.opponent &&
                    preThenContext.target.bonusIcons.length > 0,
                gameAction: ability.actions.loseAmber({
                    amount: preThenContext.target ? preThenContext.target.bonusIcons.length : 0
                }),
                message: '{0} uses {1} to make {3} lose {4} amber',
                messageArgs: (context) => [
                    context.player.opponent,
                    preThenContext.target ? preThenContext.target.bonusIcons.length : 0
                ]
            })
        });
    }
}

CauterizeVitality.id = 'cauterize-vitality';

module.exports = CauterizeVitality;
