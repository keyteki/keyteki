import Card from '../../Card.js';

class Discombobulator extends Card {
    // This creature gains, Your A cannot be stolen.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                effect: ability.effects.playerCannot('steal')
            })
        });
    }
}

Discombobulator.id = 'discombobulator';

export default Discombobulator;
