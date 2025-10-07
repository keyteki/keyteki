import Card from '../../Card.js';

class TheVaultkeeper extends Card {
    // Your A cannot be stolen.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.playerCannot('steal')
        });
    }
}

TheVaultkeeper.id = 'the-vaultkeeper';

export default TheVaultkeeper;
