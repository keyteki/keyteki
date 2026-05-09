const Card = require('../../Card.js');

class AmbrosiaOutpost extends Card {
    // Action: Put a friendly creatue on the bottom of its owner's deck. If you do, move 1A from a friendly creature to your pool.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => card.hasToken('amber'),
                    gameAction: ability.actions.removeAmber()
                },
                then: (preThenContext) => ({
                    gameAction: ability.actions.gainAmber(),
                    message: '{0} uses {1} to move 1 amber from {3} to their pool',
                    messageArgs: [preThenContext.target]
                })
            }
        });
    }
}

AmbrosiaOutpost.id = 'æmbrosia-outpost';

module.exports = AmbrosiaOutpost;
