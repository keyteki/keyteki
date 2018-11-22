const Card = require('../../Card.js');

class TheVaultkeeper extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.playerCannot('steal')
        });
    }
}

TheVaultkeeper.id = 'the-vaultkeeper'; // This is a guess at what the id might be - please check it!!!

module.exports = TheVaultkeeper;
