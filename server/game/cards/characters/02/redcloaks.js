const DrawCard = require('../../../drawcard.js');

class RedCloaks extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold from your gold pool to this card',
            method: 'addGold',
            limit: ability.limit.perPhase(1)
        });
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'intrigue',
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens['gold'])
        });
    }

    addGold(player) {
        if(this.location !== 'play area' || player.gold <= 0) {
            return false;
        }

        this.addToken('gold', 1);
        this.game.addGold(this.controller, -1);

        this.game.addMessage('{0} moves 1 gold from their gold pool to {1}', this.controller, this);
    }
}

RedCloaks.code = '02070';

module.exports = RedCloaks;
