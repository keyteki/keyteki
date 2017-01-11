const DrawCard = require('../../../drawcard.js');

class LittleBird extends DrawCard {
    setupCardAbilities(dsl) {
        this.whileAttached({
            effect: dsl.effects.addIcon('intrigue')
        });
    }
}

LittleBird.code = '01034';

module.exports = LittleBird;
