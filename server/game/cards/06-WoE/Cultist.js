const Card = require('../../Card.js');

class Cultist extends Card {
    //Action:  Destroy $this. If you do, Ward a friendly creature.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.destroy((context) => ({
                target: context.source
            })),
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.ward()
                },
                message: '{0} wards {2}', // can't use the token name here because it's already flipped over in the discard
                messageArgs: (context) => [context.player, context.target]
            }
        });
    }
}

Cultist.id = 'cultist';

module.exports = Cultist;
