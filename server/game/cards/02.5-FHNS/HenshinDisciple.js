const DrawCard = require('../../drawcard.js');

class HenshinDisciple extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.rings['air'].claimed && this.game.rings['air'].claimedBy === this.controller.name) || 
                (this.game.currentConflict && this.game.currentConflict.hasElement('air')
            ),
            match: this,
            effect: ability.effects.modifyPoliticalSkill(2)
        });
        this.persistentEffect({
            condition: () => (
                this.game.rings['earth'].claimed && this.game.rings['earth'].claimedBy === this.controller.name) || 
                (this.game.currentConflict && this.game.currentConflict.hasElement('earth')
            ),
            match: this,
            effect: ability.effects.modifyMilitarySkill(2)
        });
        this.persistentEffect({
            condition: () => (
                this.game.rings['fire'].claimed && this.game.rings['fire'].claimedBy === this.controller.name) || 
                (this.game.currentConflict && this.game.currentConflict.hasElement('fire')
            ),
            match: this,
            effect: ability.effects.addKeyword('pride')
        });
    }
}

HenshinDisciple.id = 'henshin-disciple';

module.exports = HenshinDisciple;
