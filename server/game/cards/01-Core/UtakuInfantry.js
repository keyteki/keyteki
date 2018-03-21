const DrawCard = require('../../drawcard.js');

class UtakuInfantry extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: this,
            effect: [
                ability.effects.dynamicMilitarySkill(() => this.getNoOfUnicornCharacters()),
                ability.effects.dynamicPoliticalSkill(() => this.getNoOfUnicornCharacters())
            ]
        });
    }

    getNoOfUnicornCharacters() {
        return this.controller.cardsInPlay.filter(card => card.isParticipating() && card.isFaction('unicorn')).length;
    }
}

UtakuInfantry.id = 'utaku-infantry';

module.exports = UtakuInfantry;

