const DrawCard = require('../../drawcard.js');

class TirelessSodanSenzo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating() && this.game.currentConflict.loser === this.controller,
            match: this,
            effect: ability.effects.doesNotBow()
        });
    }
}

TirelessSodanSenzo.id = 'tireless-sodan-senzo';

module.exports = TirelessSodanSenzo;
