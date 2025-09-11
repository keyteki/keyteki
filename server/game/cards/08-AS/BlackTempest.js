const Card = require('../../Card.js');

class BlackTempest extends Card {
    // After Fight: If you have no forged keys, steal 3A. Otherwise,
    // steal 2A.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.getForgedKeys() === 0 ? 3 : 2
            }))
        });
    }
}

BlackTempest.id = 'black-tempest';

module.exports = BlackTempest;
