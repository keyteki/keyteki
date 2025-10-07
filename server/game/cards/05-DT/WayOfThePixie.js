import Card from '../../Card.js';

class WayOfThePixie extends Card {
    // This creature gains, "Reap: Gain 1A."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.gainAmber({ amount: 1 })
            })
        });
    }
}

WayOfThePixie.id = 'way-of-the-pixie';

export default WayOfThePixie;
