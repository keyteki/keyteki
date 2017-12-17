const DrawCard = require('../../drawcard.js');

class SeppunIshikawa extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.dynamicMilitarySkill(() => this.getImperialCardsInPlay()),
                ability.effects.dynamicPoliticalSkill(() => this.getImperialCardsInPlay())
            ]
        });
    }

    getImperialCardsInPlay() {
        return this.game.allCards.reduce((sum, card) => {
            if(card !== this && card.controller === this.controller && card.hasTrait('imperial') && !card.facedown &&
                (card.location === 'play area' || (card.isProvince && !card.isBroken) ||
                (['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(card.location) && 
                 card.type === 'holding'))) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
}

SeppunIshikawa.id = 'seppun-ishikawa';

module.exports = SeppunIshikawa;
