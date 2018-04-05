const DrawCard = require('../../drawcard.js');

class KaitoKosori extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentConflict && this.game.currentConflict.hasElement('air') && !this.isParticipating() && 
                             this.allowGameAction('countForResolution') && !this.bowed,
            match: this,
            effect: ability.effects.contributeToConflict()
        });
    }
}

KaitoKosori.id = 'kaito-kosori';

module.exports = KaitoKosori;
