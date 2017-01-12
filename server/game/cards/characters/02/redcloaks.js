const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class RedCloaks extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move 1 gold from your gold pool to this card',
            method: 'addGold',
            limit: AbilityLimit.perPhase(1)
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

    onAttackersDeclared(e, challenge) {
        if(this.location !== 'play area' || this.controller !== challenge.attackingPlayer || challenge.challengeType !== 'intrigue') {
            return;
        }

        this.untilEndOfChallenge(ability => ({
            match: this,
            effect: ability.effects.modifyStrength(this.tokens['gold'] || 0)
        }));
    }
}

RedCloaks.code = '02070';

module.exports = RedCloaks;
