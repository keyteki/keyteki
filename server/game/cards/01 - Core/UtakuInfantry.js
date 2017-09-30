const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class UtakuInfantry extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this),
            match: this,
            recalculateWhen: ['onMove', 'onPlayIntoConflict'],
            effect: [
                ability.effects.dynamicMilitarySkill(() => this.getNoOfUnicornCharacters()),
                ability.effects.dynamicPoliticalSkill(() => this.getNoOfUnicornCharacters())
            ]
        });
    }
    
    getNoOfUnicornCharacters() {
        if(!this.game.currentConflict) {
            return 0;
        }
        
        if(this.game.currentConflict.isAttacking(this)) {
            return _.size(_.filter(this.game.currentConflict.attackers, card => card.isFaction('unicorn')));
        } 
        
        return _.size(_.filter(this.game.currentConflict.defenders, card => card.isFaction('unicorn')));            
        
    }
}

UtakuInfantry.id = 'utaku-infantry';

module.exports = UtakuInfantry;

