const Card = require('../../Card.js');

class EaterOfTheDead extends Card {
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
