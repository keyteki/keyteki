const DrawCard = require('../../../drawcard.js');

class ValyrianSteelDagger extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'intrigue'
            ),
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.addKeyword('stealth')
            ]
        });      
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }
        return super.canAttach(player, card);
    }
}

ValyrianSteelDagger.code = '05021';

module.exports = ValyrianSteelDagger;
