const DrawCard = require('../../drawcard.js');

class MagnificentKimono extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('pride')
        });
    }
}

MagnificentKimono.id = 'magnificent-kimono';

module.exports = MagnificentKimono;


