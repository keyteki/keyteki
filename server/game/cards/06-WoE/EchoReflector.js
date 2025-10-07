import Card from '../../Card.js';

class EchoReflector extends Card {
    //This creature gains, "Your opponent's keys cost +3 A."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(() => 3)
            })
        });
    }
}

EchoReflector.id = 'echo-reflector';

export default EchoReflector;
