const DrawCard = require('../../../drawcard.js');

class DragonglassDagger extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isParticipating(this.parent),
            //TO DO: Immune to opponents' character abilities
            effect: ability.effects.modifyStrength(2)
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
