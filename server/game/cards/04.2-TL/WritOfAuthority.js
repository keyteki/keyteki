const DrawCard = require('../../drawcard.js');

class WritOfAuthority extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.terminalCondition({
                condition: () => this.controller.opponent && this.controller.opponent.honor > this.controller.honor,
                message: '{0} is discarded from play as its controller has less honor',
                gameAction: ability.actions.discardFromPlay()
            })
        });
    }
}

WritOfAuthority.id = 'writ-of-authority'; //double check this before PR

module.exports = WritOfAuthority;
