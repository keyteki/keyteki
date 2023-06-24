const Card = require('../../Card.js');

class EaterOfTheDead extends Card {
    // Fight/Reap: Purge a creature from a discard pile. If you do, put a +1power counter on Eater of the Dead.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                location: 'discard',
                gameAction: ability.actions.purge({ location: 'discard' })
            },
            then: (context) => ({
                gameAction: ability.actions.addPowerCounter({ target: context.source })
            })
        });
    }
}

EaterOfTheDead.id = 'eater-of-the-dead';

module.exports = EaterOfTheDead;
