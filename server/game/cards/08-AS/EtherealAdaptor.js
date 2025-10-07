import Card from '../../Card.js';

class EtherealAdaptor extends Card {
    // This creature gains, “You may spend A on this creature as if it
    // were in your pool.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.keyAmber()
        });
    }
}

EtherealAdaptor.id = 'ethereal-adaptor';

export default EtherealAdaptor;
