const Card = require('../../Card.js');

class EtherealAdaptor extends Card {
    // This creature gains, “You may spend A on this creature as if it
    // were in your pool.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.forgeAmberSource('controller', 'onCard')
        });
    }
}

EtherealAdaptor.id = 'ethereal-adaptor';

module.exports = EtherealAdaptor;
