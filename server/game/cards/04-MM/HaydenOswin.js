const Card = require('../../Card.js');

class HaydenOswin extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.source.upgrades.length
            }))
        });
    }
}

HaydenOswin.id = 'hayden-oswin';

module.exports = HaydenOswin;
