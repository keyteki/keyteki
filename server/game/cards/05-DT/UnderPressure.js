import Card from '../../Card.js';

class UnderPressure extends Card {
    // This creature cannot ready.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('ready')
        });
    }
}

UnderPressure.id = 'under-pressure';

export default UnderPressure;
