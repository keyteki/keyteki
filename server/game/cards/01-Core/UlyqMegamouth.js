const Card = require('../../Card.js');

class UlyqMegamouth extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.use()
            }
        });
    }
}

UlyqMegamouth.id = 'ulyq-megamouth';

module.exports = UlyqMegamouth;
