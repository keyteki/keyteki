const DrawCard = require('../../../drawcard.js');

class LittleBird extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('intrigue')
        });
    }
}

LittleBird.code = '01034';

module.exports = LittleBird;
