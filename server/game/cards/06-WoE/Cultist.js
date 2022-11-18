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
                }
            }
        });
    }
}

Cultist.id = 'cultist';

module.exports = Cultist;
