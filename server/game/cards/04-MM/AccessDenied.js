import Card from '../../Card.js';

class AccessDenied extends Card {
    // This creature cannot reap.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('reap')
        });
    }
}

AccessDenied.id = 'access-denied';

export default AccessDenied;
