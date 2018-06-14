const DrawCard = require('../../drawcard.js');

class KaitoKosori extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.cardsInPlay.any(card => card.isParticipating()) && 
                             this.game.currentConflict.hasElement('air') && !this.isParticipating(),
            effect: ability.effects.contributeToConflict(this)
        });
    }
}

KaitoKosori.id = 'kaito-kosori';

module.exports = KaitoKosori;
