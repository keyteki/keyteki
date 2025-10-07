import Card from '../../Card.js';

class Tentaclid extends Card {
    // Skirmish. Taunt.
    // Tentaclid cannot reap.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cardCannot('reap')
        });
    }
}

Tentaclid.id = 'tentaclid';

export default Tentaclid;
