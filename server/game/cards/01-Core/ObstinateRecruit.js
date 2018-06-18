const DrawCard = require('../../drawcard.js');

class ObstinateRecruit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.terminalCondition({
                condition:  () => this.controller.opponent && this.controller.opponent.honor > this.controller.honor,
                message: '{0} is discarded from play as its controller has less honor',
                gameAction: ability.actions.discardFromPlay()
            })
        });
    }
}

ObstinateRecruit.id = 'obstinate-recruit';

module.exports = ObstinateRecruit;
