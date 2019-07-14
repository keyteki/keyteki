const Card = require('../../Card.js');

class TheVaultkeeper extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.playerCannot('steal')
        });
    }
}

TheVaultkeeper.id = 'the-vaultkeeper';

module.exports = TheVaultkeeper;
