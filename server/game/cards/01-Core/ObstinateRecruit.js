const DrawCard = require('../../drawcard.js');

class ObstinateRecruit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.opponent && this.controller.opponent.honor > this.controller.honor,
            match: this,
            effect: ability.effects.discardFromPlayEffect()
        });
    }
}

ObstinateRecruit.id = 'obstinate-recruit';

module.exports = ObstinateRecruit;
