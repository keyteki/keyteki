const DrawCard = require('../../../drawcard.js');

class DragonglassDagger extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isParticipating(this.parent),
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.immuneTo(card => card.controller !== this.controller && card.getType() === 'character')
            ]
        });
    }

    canAttach(player, card) {
        if(!card.isFaction('thenightswatch') || card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

DragonglassDagger.code = '04086';

module.exports = DragonglassDagger;
