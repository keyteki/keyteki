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
            then: context => ({
                gameAction: ability.actions.modifyPowerToken({ target: context.source })
            })
        });
    }
}

EaterOfTheDead.id = 'eater-of-the-dead'; // This is a guess at what the id might be - please check it!!!

module.exports = EaterOfTheDead;
