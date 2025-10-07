import Card from '../../Card.js';

class ToxicudaVenom extends Card {
    //This creature gains poison. (Any damage dealt by this creature's power during a fight destroyes the damaged creature.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({
                poison: 1
            })
        });
    }
}

ToxicudaVenom.id = 'toxicuda-venom';

export default ToxicudaVenom;
